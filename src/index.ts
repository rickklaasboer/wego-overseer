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
import {KortebroekCommand} from '@/commands/fun/KortebroekCommand';
import {PingCommand} from '@/commands/PingCommand';
import {StufiCommand} from '@/commands/fun/StufiCommand';
import {HelpCommand} from '@/commands/HelpCommand';
import {WhereMemeCommand} from '@/commands/meme/WhereMemeCommand';
import {IAmDadEvent} from './events/meme/IAmDadEvent';
import {BangerEvent} from './events/meme/BangerEvent';
import {SpooktoberCommand} from './commands/meme/SpooktoberCommand';
import {DeepFryCommand} from './commands/meme/DeepFryCommand';
import {JokeMemeCommand} from './commands/meme/JokeMemeCommand';
import {MockifyCommand} from './commands/text/MockifyCommand';
import {DrakeMemeCommand} from './commands/meme/DrakeMemeCommand';
import {UwuCommand} from './commands/text/UwuCommand';
import {MarieKondoCommand} from './commands/meme/MarieKondoCommand';
import {MotivationalQuoteCommand} from './commands/meme/MotivationalQuoteCommand';
import {I18n} from 'i18n';
import {KabelbaanNoobEvent} from '@/events/meme/KabelbaanNoobEvent';
import {UpvoteEvent} from './events/UpvoteEvent';
import {Client} from 'discord.js';
import {AdventOfCodeCommand} from './commands/misc/AdventOfCodeCommand';
import { PollCommand } from './commands/PollCommand';

const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID ?? '';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

const logger = new Logger('wego-overseer:index');

export let bot: Maybe<Bot> = null;

export const i18n = new I18n({
    directory: __dirname + '/lang',
});

export let client: Client<boolean>;

// Setup knex connection for objection
Model.knex(knex(knexfile));

dayjs.extend(utc);
dayjs.extend(timezone);

(async () => {
    bot = new Bot({
        applicationId: DISCORD_APPLICATION_ID,
        token: DISCORD_TOKEN,
        commands: [
            PingCommand,
            KortebroekCommand,
            StufiCommand,
            WhereMemeCommand,
            SpooktoberCommand,
            HelpCommand,
            DeepFryCommand,
            JokeMemeCommand,
            MockifyCommand,
            DrakeMemeCommand,
            UwuCommand,
            MarieKondoCommand,
            MotivationalQuoteCommand,
            AdventOfCodeCommand,
            PollCommand
        ],
        events: [IAmDadEvent, BangerEvent, UpvoteEvent, KabelbaanNoobEvent],
    });

    try {
        client = await bot.boot();
        logger.info(`Bot now ready and listening as '${client.user?.tag}'`);
    } catch (err) {
        logger.fatal(err);
    }
})();
