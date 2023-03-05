import {BotContext} from '@/Bot';
import {CronJob} from 'cron';
import {BirthdayJob, onTick as onBirthdayJobTick} from './BirthdayJob';

export default [[BirthdayJob, onBirthdayJobTick]] as Array<
    [CronJob, (ctx: BotContext) => Promise<void>]
>;
