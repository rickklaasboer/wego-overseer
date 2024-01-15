import Poll from '@/entities/Poll';
import BaseRepository, {PrimaryKey} from '@/repositories/BaseRepository';
import {Maybe} from '@/types/util';

export default class PollRepository implements BaseRepository<Poll> {
    /**
     * Get a poll by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Poll>> {
        const result = await Poll.query().findById(id);
        return result;
    }

    /**
     * Get all polls
     */
    public async getAll(): Promise<Poll[]> {
        const results = await Poll.query();
        return results;
    }

    /**
     * Create a new poll
     */
    public async create(data: Partial<Poll>): Promise<Poll> {
        const result = await Poll.query().insert(data);
        return result;
    }

    /**
     * Update a poll
     */
    public async update(id: PrimaryKey, data: Partial<Poll>): Promise<Poll> {
        const result = await Poll.query().updateAndFetchById(id, data);
        return result;
    }

    /**
     * Delete a poll
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await Poll.query().deleteById(id);
    }
}
