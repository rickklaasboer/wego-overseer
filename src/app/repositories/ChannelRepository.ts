import Cache from '@/app/cache/Cache';
import Channel from '@/app/entities/Channel';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class ChannelRepository implements BaseRepository<Channel> {
    constructor(private cache: Cache) {}

    /**
     * Get a channel by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Channel>> {
        return this.cache.remember(['channel', id], 600, async () => {
            return await Channel.query().findById(id);
        });
    }

    /**
     * Check if a channel exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all channels
     */
    public async getAll(): Promise<Channel[]> {
        return this.cache.remember(['channels'], 600, async () => {
            return await Channel.query();
        });
    }

    /**
     * Create a new channel
     */
    public async create(data: Partial<Channel>): Promise<Channel> {
        const result = await Channel.query().insert(data);
        await this.cache.forget(['channels']);
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
        await this.cache.forget(['channel', id]);
        return result;
    }

    /**
     * Delete a channel
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await this.cache.forget(['channel', id]);
        await Channel.query().deleteById(id);
    }
}
