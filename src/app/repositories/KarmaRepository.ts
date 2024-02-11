import Karma from '@/app/entities/Karma';
import KarmaClusterWeek from '@/app/entities/KarmaClusterWeek';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import KnexService from '@/app/services/KnexService';
import {Maybe} from '@/types/util';
import Logger from 'bunyan';
import { raw } from 'mysql2';
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
     * Check if karma exists
     */
    public async exists(data: Partial<Karma>): Promise<[boolean, string]> {
        const result = await Karma.query().where(data).first();
        return [!!result, result?.id ?? ''];
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
     * Get sum karma of user
     */
    public async getKarmaSum(
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
     * Get individual karma of user
     */
    public async getKarma(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<KarmaClusterWeek[]> {
        const knex = this.knexService.getKnex();
        
        const result = (await KarmaClusterWeek.query()
        .select(knex.raw("DATE_FORMAT(createdAt, '%x-%v') AS week, SUM(amount) AS amount, guildId, userId"))
            .where({guildId, userId})
            .orderBy('createdAt', 'asc')
            .groupBy('week')
            .limit(293) as KarmaClusterWeek[]
        );
        
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
