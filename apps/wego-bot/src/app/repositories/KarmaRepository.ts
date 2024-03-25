import Cache from '@/app/cache/Cache';
import Karma from '@/app/entities/Karma';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import KnexService from '@/app/services/KnexService';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

type LeaderboardRow = {
    userId: string;
    totalReceivedKarma: string;
};

@injectable()
export default class KarmaRepository implements BaseRepository<Karma> {
    constructor(
        private knexService: KnexService,
        private cache: Cache,
    ) {}

    /**
     * Get karma by ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Karma>> {
        return this.cache.remember(['karma', id], 600, async () => {
            return await Karma.query().findById(id);
        });
    }

    /**
     * Get karma by where condition
     */
    public async getByWhere(condition: Partial<Karma>): Promise<Maybe<Karma>> {
        return this.cache.remember(
            ['karma', 'condition', JSON.stringify(condition)],
            600,
            async () => {
                return await Karma.query().where(condition).first();
            },
        );
    }

    /**
     * Check if a karma entry exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all karma
     */
    public async getAll(): Promise<Karma[]> {
        return this.cache.remember(['karma'], 600, async () => {
            return await Karma.query();
        });
    }

    /**
     * Create karma
     */
    public async create(data: Partial<Karma>): Promise<Karma> {
        const result = await Karma.query().insert(data);
        await this.cache.forget(['karma']);
        return result;
    }

    /**
     * Update karma
     */
    public async update(id: PrimaryKey, data: Partial<Karma>): Promise<Karma> {
        const result = await Karma.query().updateAndFetchById(id, data);
        await this.cache.forget(['karma', id]);
        return result;
    }

    /**
     * Delete karma
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await this.cache.forget(['karma', id]);
        await Karma.query().deleteById(id);
    }

    /**
     * Get leaderboard
     */
    public async getLeaderboard(
        guildId: PrimaryKey,
    ): Promise<LeaderboardRow[]> {
        return this.cache.remember(
            ['karma', 'leaderboard', guildId],
            600,
            async () => {
                return (await this.knexService
                    .getKnex()
                    .table('karma')
                    .select('userId')
                    .sum('amount as totalReceivedKarma')
                    .where('guildId', '=', guildId)
                    .orderBy('totalReceivedKarma', 'desc')
                    .groupBy('userId')) as LeaderboardRow[];
            },
        );
    }

    /**
     * Get sum karma of user
     */
    public async getTotalKarma(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<Karma & {totalKarma: number}> {
        return this.cache.remember(
            ['karma', 'totalKarma', guildId, userId],
            600,
            async () => {
                return (await Karma.query()
                    .where({guildId, userId})
                    .sum('amount as totalKarma')
                    .first()) as Karma & {totalKarma: number};
            },
        );
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

        await this.cache.forget(['karma', 'totalKarma', guildId, userId]);
        await this.cache.forget(['karma', 'leaderboard', guildId]);
        await this.cache.forget(['karma']);

        return rowsAffected;
    }
}
