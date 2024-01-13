import Channel from '@/entities/Channel';
import BaseRepository, {PrimaryKey} from '@/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class ChannelRepository implements BaseRepository<Channel> {
    /**
     * Get a channel by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Channel>> {
        const result = await Channel.query().findById(id);
        return result;
    }

    /**
     * Get all channels
     */
    public async getAll(): Promise<Channel[]> {
        const results = await Channel.query();
        return results;
    }

    /**
     * Create a new channel
     */
    public async create(data: Partial<Channel>): Promise<Channel> {
        const result = await Channel.query().insert(data);
        return result;
    }

    /**
     * Update a channel
     */
    public async update(
        id: PrimaryKey,
        data: Partial<Channel>,
    ): Promise<Channel> {
        const result = await Channel.query().updateAndFetchById(id, data);
        return result;
    }

    /**
     * Delete a channel
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await Channel.query().deleteById(id);
    }
}
