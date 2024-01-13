import GuildUser from '@/entities/GuildUser';
import {PrimaryKey} from '@/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class GuildUserRepository {
    /**
     * Get a guild user by its ID
     */
    public async getById(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<Maybe<GuildUser>> {
        const result = await GuildUser.query().findById([guildId, userId]);
        return result;
    }

    /**
     * Check if a guild user exists
     */
    public async exists(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<boolean> {
        const result = await GuildUser.query().findById([guildId, userId]);
        return !!result;
    }

    /**
     * Get all guild users
     */
    public async getAll(): Promise<GuildUser[]> {
        const result = await GuildUser.query();
        return result;
    }

    /**
     * Create a new guild user
     */
    public async create(data: Partial<GuildUser>): Promise<GuildUser> {
        const result = await GuildUser.query().insert(data);
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
        return result;
    }

    /**
     * Delete a guild user
     */
    public async delete(
        userId: PrimaryKey,
        guildId: PrimaryKey,
    ): Promise<void> {
        await GuildUser.query().deleteById([userId, guildId]);
    }
}
