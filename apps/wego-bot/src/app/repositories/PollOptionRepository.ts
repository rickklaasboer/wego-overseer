import PollOption from '@/app/entities/PollOption';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';

export default class PollOptionRepository
    implements BaseRepository<PollOption>
{
    /**
     * Get a poll option by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<PollOption>> {
        const result = PollOption.query().findById(id);
        return result;
    }

    /**
     * Check if a poll option exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all poll options
     */
    public async getAll(): Promise<PollOption[]> {
        const results = PollOption.query();
        return results;
    }

    /**
     * Create a new poll option
     */
    public async create(data: Partial<PollOption>): Promise<PollOption> {
        const result = PollOption.query().insert(data);
        return result;
    }

    /**
     * Update a poll option
     */
    public async update(
        id: PrimaryKey,
        data: Partial<PollOption>,
    ): Promise<PollOption> {
        const result = PollOption.query().updateAndFetchById(id, data);
        return result;
    }

    /**
     * Delete a poll option
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await PollOption.query().deleteById(id);
    }
}
