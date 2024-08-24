import 'reflect-metadata';
import 'dotenv/config';
import {Model} from 'objection';
import Bot from '@/Bot';
import KnexService from '@/app/services/KnexService';
import {setLocalizationInstance} from '@/util/localization/localization';
import LocalizationService from '@/app/services/LocalizationService';
import {app} from '@/util/misc/misc';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {container} from 'tsyringe';
import Logger from '@wego/logger';
import config from '@/config';

dayjs.extend(duration);
dayjs.extend(relativeTime);

// We need to register the logger ourselves because it's coming from a different package
// Also, make sure to register it before the bot so that the logger is available to the bot
container.register(Logger, {
    useValue: new Logger('wego-overseer', config.app.logLevel),
});

const bot = app(Bot);

// Pass the knex instance to objection
// I would've preferred to let dependency injection handle this but Objection does not support it
// So here we are
Model.knex(app(KnexService).getKnex());

// Set the localization instance
setLocalizationInstance(app(LocalizationService).getI18n());

bot.start().catch(console.error);
