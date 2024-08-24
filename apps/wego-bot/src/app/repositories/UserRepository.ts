import Cache from '@/app/cache/Cache';
import User from '@/app/entities/User';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import dayjs from 'dayjs';
import {injectable} from 'tsyringe';

@injectable()
export default class UserRepository implements BaseRepository<User> {
    constructor(private cache: Cache) {}

    /**
     * Get a user by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<User>> {
        return this.cache.remember(['user', id], 600, async () => {
            return await User.query().findById(id);
        });
    }

    /**
     * Get a user by its ID and guild ID
     */
    public async getByGuildId(
        id: PrimaryKey,
        guildId: PrimaryKey,
    ): Promise<Maybe<User>> {
        return this.cache.remember(['user', id, guildId], 600, async () => {
            return await User.query()
                .joinRelated('guilds')
                .where('guilds.id', guildId)
                .findById(id);
        });
    }

    /**
     * Check if a user exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all users
     */
    public async getAll(): Promise<User[]> {
        return this.cache.remember(['users'], 600, async () => {
            return await User.query();
        });
    }

    /**
     * Get all users with guilds
     */
    public async getAllWithGuilds(): Promise<User[]> {
        return this.cache.remember(['usersWithGuilds'], 600, async () => {
            return await User.query()
                .withGraphFetched({guilds: true})
                .whereNotNull('dateOfBirth');
        });
    }

    /**
     * Get all users with guilds
     */
    public async getTodaysBirthdays(): Promise<User[]> {
        return this.cache.remember(['todaysBirthdays'], 600, async () => {
            return await User.query()
                .whereNotNull('dateOfBirth')
                .where('dateOfBirth', 'LIKE', dayjs().format('____-MM-DD'))
                .withGraphFetched({guilds: true});
        });
    }

    /**
     * Create a new user
     */
    public async create(data: Partial<User>): Promise<User> {
        const result = await User.query().insert(data);
        await this.cache.forget(['users']);
        await this.cache.forget(['usersWithGuilds']);
        await this.cache.forget(['todaysBirthdays']);
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
        await this.cache.forget(['user', userId]);
        await this.cache.forget(['users']);
        await this.cache.forget(['usersWithGuilds']);
        await this.cache.forget(['todaysBirthdays']);
        return result;
    }

    /**
     * Delete a user
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await this.cache.forget(['user', id]);
        await this.cache.forget(['users']);
        await this.cache.forget(['usersWithGuilds']);
        await this.cache.forget(['todaysBirthdays']);
        await User.query().deleteById(id);
    }
}
