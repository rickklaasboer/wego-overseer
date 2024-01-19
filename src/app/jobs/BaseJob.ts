import CronJob from '@/util/CronJob';

export default interface BaseJob {
    /**
     * The name of the job (should be unique!)
     */
    name: string;
    /**
     * The job to run
     */
    job: CronJob;
    /**
     * Run the job
     */
    execute(): Promise<void>;
}
