import Cache from '@/app/cache/Cache';
import Reminder from '@/app/entities/Reminder';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class ReminderRepository implements BaseRepository<Reminder> {
    constructor(private cache: Cache) {}

    /**
     * Get a reminder by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Reminder>> {
        return this.cache.remember(['reminder', id], 600, async () => {
            return await Reminder.query().findById(id);
        });
    }

    /**
     * Check if a reminder exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all reminders
     */
    public async getAll(): Promise<Reminder[]> {
        return this.cache.remember(['reminders'], 600, async () => {
            return await Reminder.query();
        });
    }

    /**
     * Create a new reminder
     */
    public async create(data: Partial<Reminder>): Promise<Reminder> {
        const result = await Reminder.query().insert(data);
        await this.cache.forget(['reminders']);
        return result;
    }

    /**
     * Update a reminder
     */
    public async update(
        id: PrimaryKey,
        data: Partial<Reminder>,
    ): Promise<Reminder> {
        const result = await Reminder.query().updateAndFetchById(id, data);
        await this.cache.forget(['reminder', id]);
        await this.cache.forget(['reminders']);
        return result;
    }

    /**
     * Delete a reminder
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await this.cache.forget(['reminder', id]);
        await this.cache.forget(['reminders']);
        await Reminder.query().deleteById(id);
    }
}
