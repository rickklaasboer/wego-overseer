import {BotContext} from '@/Bot';
import {CronJob} from 'cron';

type Props = {
    name: string;
    job: CronJob;
    onTick: (ctx: BotContext) => Promise<void>;
};

export default class Job {
    public name: string;
    public job: CronJob;
    public onTick: (ctx: BotContext) => Promise<void>;

    constructor({name, job, onTick}: Props) {
        this.name = name;
        this.job = job;
        this.onTick = onTick;
    }
}
