import BaseJob from '@/app/jobs/BaseJob';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';
import cron from 'node-cron';

@injectable()
export default class JobHandler {
    constructor(private logger: Logger) {}

    /**
     * Handle the Job
     */
    public async handle(job: BaseJob): Promise<void> {
        try {
            cron.schedule(job.schedule, async () => {
                await job.execute();
            });
        } catch (err) {
            this.logger.fatal(`Failed to execute job ${job.name}`, err);
        }
    }
}
