import User from '@/app/entities/User';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import dayjs from 'dayjs';
import {injectable} from 'tsyringe';

@injectable()
export default class UserRepository implements BaseRepository<User> {
    /**
     * Get a user by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<User>> {
        const result = await User.query().findById(id);
        return result;
    }

    /**
     * Get a user by its ID and guild ID
     */
    public async getByGuildId(
        id: PrimaryKey,
        guildId: PrimaryKey,
    ): Promise<Maybe<User>> {
        const result = await User.query()
            .joinRelated('guilds')
            .where('guilds.id', guildId)
            .findById(id);

        return result;
    }

    /**
     * Get all users
     */
    public async getAll(): Promise<User[]> {
        const results = await User.query();
        return results;
    }

    /**
     * Get all users with guilds
     */
    public async getAllWithGuilds(): Promise<User[]> {
        const results = await User.query()
            .withGraphFetched({guilds: true})
            .whereNotNull('dateOfBirth');

        return results;
    }

    /**
     * Get all users with guilds
     */
    public async getTodaysBirthdays(): Promise<User[]> {
        const results = await User.query()
            .whereNotNull('dateOfBirth')
            .where('dateOfBirth', 'LIKE', dayjs().format('____-MM-DD'))
            .withGraphFetched({guilds: true});

        return results;
    }

    /**
     * Create a new user
     */
    public async create(data: Partial<User>): Promise<User> {
        const result = await User.query().insert(data);
        return result;
    }

    /**
     * Get a user by its ID or create it if it doesn't exist
     */
    public async getByIdOrCreate(data: Partial<User>): Promise<User> {
        const exists = await this.getById(data.id!);

        if (!exists) {
            return this.create(data);
        }

        return exists;
    }

    /**
     * Update a user
     */
    public async update(
        userId: PrimaryKey,
        data: Partial<User>,
    ): Promise<User> {
        const result = await User.query().updateAndFetchById(userId, data);
        return result;
    }

    /**
     * Delete a user
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await User.query().deleteById(id);
    }
}
