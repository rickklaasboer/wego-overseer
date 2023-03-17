import {CronCommand, CronJob} from 'cron';
import {DateTime} from 'luxon';
import {noop} from './misc';

type CronParameters = {
    cronTime: string | Date | DateTime;
    onTick?: CronCommand;
    onComplete?: CronCommand | null;
    startNow?: boolean;
    timeZone?: string;
    // The cron library also defines this as any ¯\_(ツ)_/¯
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    context?: any;
    runOnInit?: boolean;
    utcOffset?: string | number;
    unrefTimeout?: boolean;
};

export default class CronJobWithDefaults extends CronJob {
    constructor({
        cronTime,
        onTick = noop,
        onComplete = null,
        startNow = false,
        ...restProps
    }: CronParameters) {
        super(
            cronTime,
            onTick,
            onComplete,
            startNow,
            ...Object.values(restProps),
        );
    }
}
