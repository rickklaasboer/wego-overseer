import User from '@/entities/User';
import BaseRepository, {PrimaryKey} from '@/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'inversify';

@injectable()
export default class UserRepository implements BaseRepository<User> {
    /**
     * Get a user by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<User>> {
        const result = await User.query().findById(id);

        if (result instanceof User) {
            return result;
        }

        return null;
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

        if (result instanceof User) {
            return result;
        }

        return null;
    }

    /**
     * Get all users
     */
    public async getAll(): Promise<User[]> {
        const results = await User.query();
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
     * Update a user
     */
    public async update(data: Partial<User>): Promise<User> {
        const result = await User.query().updateAndFetch(data);
        return result;
    }

    /**
     * Delete a user
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await User.query().deleteById(id);
    }
}
