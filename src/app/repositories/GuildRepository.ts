import Guild from '@/app/entities/Guild';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class GuildRepository implements BaseRepository<Guild> {
    /**
     * Get a guild by its ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Guild>> {
        const result = await Guild.query().findById(id);

        if (result instanceof Guild) {
            return result;
        }

        return null;
    }

    /**
     * Get all guild
     */
    public async getAll(): Promise<Guild[]> {
        const results = await Guild.query();
        return results;
    }

    /**
     * Create a new guild
     */
    public async create(data: Partial<Guild>): Promise<Guild> {
        const result = await Guild.query().insert(data);
        return result;
    }

    /**
     * Update a guild
     */
    public async update(id: PrimaryKey, data: Partial<Guild>): Promise<Guild> {
        const result = await Guild.query().updateAndFetchById(id, data);
        return result;
    }

    /**
     * Delete a guild
     */
    public async delete(id: string | number): Promise<void> {
        await Guild.query().deleteById(id);
    }

    /**
     * Get a guild by its ID with birthdays
     */
    public async getGuildByIdWithBirthdays(
        guildId: PrimaryKey,
    ): Promise<Maybe<Guild>> {
        const result = await Guild.query()
            .findById(guildId)
            .withGraphFetched({users: true})
            .modifyGraph('users', (q) => {
                q.whereNotNull('dateOfBirth');
            });

        return result;
    }

    /**
     * Get a guild by its ID with upcoming birthdays between two dates
     */
    public async getGuildByIdWithUpcomingBirthdaysBetween(
        guildId: PrimaryKey,
        [from, to]: [string, string],
    ): Promise<Maybe<Guild>> {
        const result = await Guild.query()
            .findById(guildId)
            .withGraphFetched({users: true})
            .modifyGraph('users', (q) => {
                q.whereRaw(
                    "(DATE_FORMAT(dateOfBirth, '%m-%d') BETWEEN ? and ?)",
                    [from, to],
                );
            });

        return result;
    }
}
