export default interface BaseJob {
    /**
     * The name of the job (should be unique!)
     */
    name: string;

    /**
     * The job to run
     */
    schedule: string;

    /**
     * Run the job
     */
    execute(): Promise<void>;
}
