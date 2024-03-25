import Cache from '@/app/cache/Cache';
import GuildUser from '@/app/entities/GuildUser';
import {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class GuildUserRepository {
    constructor(private cache: Cache) {}

    /**
     * Get a guild user by its ID
     */
    public async getById(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<Maybe<GuildUser>> {
        return this.cache.remember(
            ['guildUser', guildId, userId],
            600,
            async () => {
                return await GuildUser.query().findById([guildId, userId]);
            },
        );
    }

    /**
     * Check if a guild user exists
     */
    public async exists(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<boolean> {
        return (await this.getById(guildId, userId)) != null;
    }

    /**
     * Get all guild users
     */
    public async getAll(): Promise<GuildUser[]> {
        return this.cache.remember(['guildUsers'], 600, async () => {
            return await GuildUser.query();
        });
    }

    /**
     * Create a new guild user
     */
    public async create(data: Partial<GuildUser>): Promise<GuildUser> {
        const result = await GuildUser.query().insert(data);
        await this.cache.forget(['guildUsers']);
        return result;
    }

    /**
     * Update a guild user
     */
    public async update(
        guildId: PrimaryKey,
        userId: PrimaryKey,
        data: Partial<GuildUser>,
    ): Promise<GuildUser> {
        const result = await GuildUser.query().updateAndFetchById(
            [guildId, userId],
            data,
        );
        await this.cache.forget(['guildUser', guildId, userId]);
        return result;
    }

    /**
     * Delete a guild user
     */
    public async delete(
        userId: PrimaryKey,
        guildId: PrimaryKey,
    ): Promise<void> {
        await this.cache.forget(['guildUser', guildId, userId]);
        await GuildUser.query().deleteById([userId, guildId]);
    }
}
