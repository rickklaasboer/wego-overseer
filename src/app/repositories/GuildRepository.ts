import Cache from '@/app/cache/Cache';
import Guild from '@/app/entities/Guild';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class GuildRepository implements BaseRepository<Guild> {
    constructor(private cache: Cache) {}

    /**
     * Get a guild by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Guild>> {
        return this.cache.remember(['guild', id], 600, async () => {
            return await Guild.query().findById(id);
        });
    }

    /**
     * Check if a guild exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all guild
     */
    public async getAll(): Promise<Guild[]> {
        return this.cache.remember(['guilds'], 600, async () => {
            return await Guild.query();
        });
    }

    /**
     * Create a new guild
     */
    public async create(data: Partial<Guild>): Promise<Guild> {
        const result = await Guild.query().insert(data);
        await this.cache.forget(['guilds']);
        return result;
    }

    /**
     * Update a guild
     */
    public async update(id: PrimaryKey, data: Partial<Guild>): Promise<Guild> {
        const result = await Guild.query().updateAndFetchById(id, data);
        await this.cache.forget(['guild', id]);
        return result;
    }

    /**
     * Delete a guild
     */
    public async delete(id: string | number): Promise<void> {
        await this.cache.forget(['guild', id]);
        await Guild.query().deleteById(id);
    }

    /**
     * Get a guild by its ID with birthdays
     */
    public async getGuildByIdWithBirthdays(
        guildId: PrimaryKey,
    ): Promise<Maybe<Guild>> {
        return this.cache.remember(
            ['guild', guildId, 'birthdays'],
            600,
            async () => {
                return await Guild.query()
                    .findById(guildId)
                    .withGraphFetched({users: true})
                    .modifyGraph('users', (q) => {
                        q.whereNotNull('dateOfBirth');
                    });
            },
        );
    }

    /**
     * Get a guild by its ID with upcoming birthdays between two dates
     */
    public async getGuildByIdWithUpcomingBirthdaysBetween(
        guildId: PrimaryKey,
        [from, to]: [string, string],
    ): Promise<Maybe<Guild>> {
        return this.cache.remember(
            ['guild', guildId, 'upcomingBirthdays', from, to],
            600,
            async () => {
                return await Guild.query()
                    .findById(guildId)
                    .withGraphFetched({users: true})
                    .modifyGraph('users', (q) => {
                        q.whereRaw(
                            "(DATE_FORMAT(dateOfBirth, '%m-%d') BETWEEN ? and ?)",
                            [from, to],
                        );
                    });
            },
        );
    }
}
