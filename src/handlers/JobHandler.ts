import BaseJob from '@/app/jobs/BaseJob';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class JobHandler {
    constructor(private logger: Logger) {}

    /**
     * Handle the Job
     */
    public async handle({name, job, execute}: BaseJob): Promise<void> {
        try {
            job.addCallback(async () => await execute());
            job.start();
        } catch (err) {
            this.logger.error(`Failed to execute job ${name}`, err);
        }
    }
}
