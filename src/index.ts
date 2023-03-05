import 'dotenv/config';
import Bot from '@/Bot';
import Logger from '@/telemetry/logger';
import knex from 'knex';
import knexfile from '../knexfile';
import {Model} from 'objection';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {I18n} from 'i18n';
import {tap} from './util/tap';
import {setLocalizationInstance} from '@/util/localization';
import APPLICATION_COMMANDS from '@/commands';
import APPLICATION_EVENTS from '@/events';
import APPLICATION_JOBS from '@/jobs';
import {getEnvString} from './util/environment';

const DISCORD_APPLICATION_ID = getEnvString('DISCORD_APPLICATION_ID', '');
const DISCORD_TOKEN = getEnvString('DISCORD_TOKEN', '');

const logger = new Logger('wego-overseer:index');

// prettier-ignore
setLocalizationInstance(new I18n({
    directory: __dirname + '/lang',
    objectNotation: true,
    defaultLocale: 'en',
}));

dayjs.extend(utc);
dayjs.extend(timezone);

(async () => {
    const bot = new Bot({
        applicationId: DISCORD_APPLICATION_ID,
        token: DISCORD_TOKEN,
        ctx: {
            db: tap(knex(knexfile), (db) => {
                db.on('query', logger.debug);
                Model.knex(db);
            }),
        },
        commands: APPLICATION_COMMANDS,
        events: APPLICATION_EVENTS,
        jobs: APPLICATION_JOBS,
    });

    try {
        await bot.boot();
        logger.info(
            `Bot now ready and listening as '${bot.ctx.client.user?.tag}'`,
        );
    } catch (err) {
        logger.fatal(err);
    }
})();
