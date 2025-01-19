import BaseJob from '@/app/jobs/BaseJob';
import ReminderRepository from '@/app/repositories/ReminderRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class ReminderJob implements BaseJob {
    public name = '';
    public schedule = '0 * * * *';

    constructor(private ReminderRepository: ReminderRepository) {}

    /**
     * Run the job
     */
    public async execute(): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
