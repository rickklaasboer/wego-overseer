import Karma from '@/entities/Karma';
import BaseRepository, {PrimaryKey} from '@/repositories/BaseRepository';
import KnexService from '@/services/KnexService';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

type LeaderboardRow = {
    userId: string;
    totalReceivedKarma: string;
};

@injectable()
export default class KarmaRepository implements BaseRepository<Karma> {
    constructor(private knexService: KnexService) {}

    /**
     * Get karma by ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Karma>> {
        const result = await Karma.query().findById(id);
        return result;
    }

    /**
     * Get all karma
     */
    public async getAll(): Promise<Karma[]> {
        const results = await Karma.query();
        return results;
    }

    /**
     * Create karma
     */
    public async create(data: Partial<Karma>): Promise<Karma> {
        const result = await Karma.query().insert(data);
        return result;
    }

    /**
     * Update karma
     */
    public async update(id: PrimaryKey, data: Partial<Karma>): Promise<Karma> {
        const result = await Karma.query().updateAndFetchById(id, data);
        return result;
    }

    /**
     * Delete karma
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await Karma.query().deleteById(id);
    }

    /**
     * Get leaderboard
     */
    public async getLeaderboard(
        guildId: PrimaryKey,
    ): Promise<LeaderboardRow[]> {
        const results = (await this.knexService
            .getKnex()
            .table('karma')
            .select('userId')
            .sum('amount as totalReceivedKarma')
            .where('guildId', '=', guildId)
            .orderBy('totalReceivedKarma', 'desc')
            .groupBy('userId')) as LeaderboardRow[];

        return results;
    }

    /**
     * Get karma of user
     */
    public async getKarma(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<Karma & {totalKarma: number}> {
        const result = (await Karma.query()
            .where({guildId, userId})
            .sum('amount as totalKarma')
            .first()) as Karma & {totalKarma: number};

        return result;
    }

    /**
     * Reset karma of user
     */
    public async resetKarma(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<number> {
        const rowsAffected = await Karma.query()
            .where('guildId', '=', guildId)
            .andWhere('userId', '=', userId)
            .delete();

        return rowsAffected;
    }
}
