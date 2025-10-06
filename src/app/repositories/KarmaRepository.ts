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

    /**
     * Get karma received by a user
     */
    public async getKarmaReceived(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{total: number; average: number; count: number}> {
        return this.cache.remember(
            ['karma', 'received', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .where('guildId', '=', guildId)
                    .andWhere('userId', '=', userId)
                    .sum('amount as total')
                    .avg('amount as average')
                    .count('* as count')
                    .first();

                return {
                    total: parseInt(result?.total || '0'),
                    average: parseFloat(result?.average || '0'),
                    count: parseInt(result?.count || '0'),
                };
            },
        );
    }

    /**
     * Get karma given by a user
     */
    public async getKarmaGiven(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{total: number; average: number; count: number}> {
        return this.cache.remember(
            ['karma', 'given', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .where('guildId', '=', guildId)
                    .andWhere('receivedFromUserId', '=', userId)
                    .sum('amount as total')
                    .avg('amount as average')
                    .count('* as count')
                    .first();

                return {
                    total: parseInt(result?.total || '0'),
                    average: parseFloat(result?.average || '0'),
                    count: parseInt(result?.count || '0'),
                };
            },
        );
    }

    /**
     * Get unique users who gave karma to a user
     */
    public async getUniqueGivers(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{count: number}> {
        return this.cache.remember(
            ['karma', 'uniqueGivers', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .where('guildId', '=', guildId)
                    .andWhere('userId', '=', userId)
                    .countDistinct('receivedFromUserId as count')
                    .first();

                return {
                    count: parseInt(result?.count || '0'),
                };
            },
        );
    }

    /**
     * Get unique users who received karma from a user
     */
    public async getUniqueReceivers(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{count: number}> {
        return this.cache.remember(
            ['karma', 'uniqueReceivers', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .where('guildId', '=', guildId)
                    .andWhere('receivedFromUserId', '=', userId)
                    .countDistinct('userId as count')
                    .first();

                return {
                    count: parseInt(result?.count || '0'),
                };
            },
        );
    }

    /**
     * Get user's favorite channel (where they receive most karma)
     */
    public async getFavoriteChannel(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{channelId: string; name: string; count: number} | null> {
        return this.cache.remember(
            ['karma', 'favoriteChannel', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .join('channels', 'karma.channelId', '=', 'channels.id')
                    .where('karma.guildId', '=', guildId)
                    .andWhere('karma.userId', '=', userId)
                    .select('karma.channelId', 'channels.name')
                    .count('* as count')
                    .groupBy('karma.channelId', 'channels.name')
                    .orderBy('count', 'desc')
                    .first();

                return result
                    ? {
                          channelId: result.channelId,
                          name: result.name,
                          count: parseInt(result.count || '0'),
                      }
                    : null;
            },
        );
    }

    /**
     * Get user who gave the most karma to a specific user
     */
    public async getTopGiver(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{userId: string; username: string; total: number} | null> {
        return this.cache.remember(
            ['karma', 'topGiver', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .join('users', 'karma.receivedFromUserId', '=', 'users.id')
                    .where('karma.guildId', '=', guildId)
                    .andWhere('karma.userId', '=', userId)
                    .select(
                        'karma.receivedFromUserId as userId',
                        'users.username',
                    )
                    .sum('karma.amount as total')
                    .groupBy('karma.receivedFromUserId', 'users.username')
                    .orderBy('total', 'desc')
                    .first();

                return result
                    ? {
                          userId: result.userId,
                          username: result.username,
                          total: parseInt(result.total || '0'),
                      }
                    : null;
            },
        );
    }

    /**
     * Get user who received the most karma from a specific user
     */
    public async getTopReceiver(
        guildId: PrimaryKey,
        userId: PrimaryKey,
    ): Promise<{userId: string; username: string; total: number} | null> {
        return this.cache.remember(
            ['karma', 'topReceiver', guildId, userId],
            600,
            async () => {
                const result = await this.knexService
                    .getKnex()
                    .table('karma')
                    .join('users', 'karma.userId', '=', 'users.id')
                    .where('karma.guildId', '=', guildId)
                    .andWhere('karma.receivedFromUserId', '=', userId)
                    .select('karma.userId', 'users.username')
                    .sum('karma.amount as total')
                    .groupBy('karma.userId', 'users.username')
                    .orderBy('total', 'desc')
                    .first();

                return result
                    ? {
                          userId: result.userId,
                          username: result.username,
                          total: parseInt(result.total || '0'),
                      }
                    : null;
            },
        );
    }

    /**
     * Get karma activity timeline (optional - for more advanced stats)
     */
    public async getKarmaTimeline(
        guildId: PrimaryKey,
        userId: PrimaryKey,
        days = 30,
    ): Promise<{date: string; received: number; given: number}[]> {
        return this.cache.remember(
            ['karma', 'timeline', guildId, userId, days],
            600,
            async () => {
                const receivedQuery = this.knexService
                    .getKnex()
                    .table('karma')
                    .select(
                        this.knexService
                            .getKnex()
                            .raw('DATE(created_at) as date'),
                        this.knexService
                            .getKnex()
                            .raw('SUM(amount) as received'),
                        this.knexService.getKnex().raw('0 as given'),
                    )
                    .where('guildId', '=', guildId)
                    .andWhere('userId', '=', userId)
                    .andWhere(
                        'created_at',
                        '>=',
                        this.knexService
                            .getKnex()
                            .raw('DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
                    )
                    .groupBy('date');

                const givenQuery = this.knexService
                    .getKnex()
                    .table('karma')
                    .select(
                        this.knexService
                            .getKnex()
                            .raw('DATE(created_at) as date'),
                        this.knexService.getKnex().raw('0 as received'),
                        this.knexService.getKnex().raw('SUM(amount) as given'),
                    )
                    .where('guildId', '=', guildId)
                    .andWhere('receivedFromUserId', '=', userId)
                    .andWhere(
                        'created_at',
                        '>=',
                        this.knexService
                            .getKnex()
                            .raw('DATE_SUB(NOW(), INTERVAL ? DAY)', [days]),
                    )
                    .groupBy('date');

                const results = await this.knexService
                    .getKnex()
                    .unionAll([receivedQuery, givenQuery])
                    .select('date')
                    .sum('received as received')
                    .sum('given as given')
                    .groupBy('date')
                    .orderBy('date', 'desc');

                return results.map((row) => ({
                    date: row.date,
                    received: parseInt(row.received || '0'),
                    given: parseInt(row.given || '0'),
                }));
            },
        );
    }
}
