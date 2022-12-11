import 'dotenv/config';
import Bot from '@/Bot';
import Logger from '@/telemetry/logger';
import knex from 'knex';
import knexfile from '../knexfile';
import {Model} from 'objection';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import {Maybe} from '@/types/util';
import {Client} from 'discord.js';
import {I18n} from 'i18n';
import {tap} from './util/tap';

// Commands
import {AdventOfCodeCommand} from '@/commands/misc/AdventOfCodeCommand';
import {DeepFryCommand} from '@/commands/meme/DeepFryCommand';
import {DrakeMemeCommand} from '@/commands/meme/DrakeMemeCommand';
import {HelpCommand} from '@/commands/HelpCommand';
import {JokeMemeCommand} from '@/commands/meme/JokeMemeCommand';
import {KarmaCommand} from '@/commands/karma/KarmaCommand';
import {KortebroekCommand} from '@/commands/fun/KortebroekCommand';
import {MarieKondoCommand} from '@/commands/meme/MarieKondoCommand';
import {MockifyCommand} from '@/commands/text/MockifyCommand';
import {MotivationalQuoteCommand} from '@/commands/meme/MotivationalQuoteCommand';
import {PingCommand} from '@/commands/PingCommand';
import {PollCommand} from '@/commands/PollCommand';
import {SpooktoberCommand} from '@/commands/meme/SpooktoberCommand';
import {StufiCommand} from '@/commands/fun/StufiCommand';
import {UwuCommand} from '@/commands/text/UwuCommand';
import {WhereMemeCommand} from '@/commands/meme/WhereMemeCommand';

// Events
import {BangerEvent} from '@/events/meme/BangerEvent';
import {IAmDadEvent} from '@/events/meme/IAmDadEvent';
import {KabelbaanNoobEvent} from '@/events/meme/KabelbaanNoobEvent';
import {KarmaDownvoteEvent} from '@/events/karma/KarmaDownvoteEvent';
import {KarmaRemoveDownvoteEvent} from '@/events/karma/KarmaRemoveDownvoteEvent';
import {KarmaRemoveUpvoteEvent} from '@/events/karma/KarmaRemoveUpvoteEvent';
import {KarmaUpvoteEvent} from '@/events/karma/KarmaUpvoteEvent';
import {UpvoteEvent} from '@/events/UpvoteEvent';

const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID ?? '';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

const logger = new Logger('wego-overseer:index');

export let bot: Maybe<Bot> = null;

export const i18n = new I18n({
    directory: __dirname + '/lang',
});

export let client: Client<boolean>;

// Setup knex connection for objection
// prettier-ignore
Model.knex(tap(knex(knexfile), (k) => {
    k.on('query', logger.debug);
}));

dayjs.extend(utc);
dayjs.extend(timezone);

(async () => {
    bot = new Bot({
        applicationId: DISCORD_APPLICATION_ID,
        token: DISCORD_TOKEN,
        commands: [
            AdventOfCodeCommand,
            DeepFryCommand,
            DrakeMemeCommand,
            HelpCommand,
            JokeMemeCommand,
            KarmaCommand,
            KortebroekCommand,
            MarieKondoCommand,
            MockifyCommand,
            MotivationalQuoteCommand,
            PingCommand,
            PollCommand,
            SpooktoberCommand,
            StufiCommand,
            UwuCommand,
            WhereMemeCommand,
        ],
        events: [
            BangerEvent,
            IAmDadEvent,
            KabelbaanNoobEvent,
            KarmaDownvoteEvent,
            KarmaRemoveDownvoteEvent,
            KarmaRemoveUpvoteEvent,
            KarmaUpvoteEvent,
            UpvoteEvent,
        ],
    });

    try {
        client = await bot.boot();
        logger.info(`Bot now ready and listening as '${client.user?.tag}'`);
    } catch (err) {
        logger.fatal(err);
    }
})();
