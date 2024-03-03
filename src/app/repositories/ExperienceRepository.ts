import Cache from '@/app/cache/Cache';
import Experience from '@/app/entities/Experience';
import ExperienceService from '@/app/services/ExperienceService';
import {toMysqlDateTime} from '@/util/misc/mysql';
import dayjs from 'dayjs';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceRepository {
    constructor(
        private experienceService: ExperienceService,
        private cache: Cache,
    ) {}

    /**
     * Gets the experience of user.
     */
    public async getExperience(
        guildId: string,
        userId: string,
    ): Promise<number> {
        return this.cache.remember(
            ['experience', guildId, userId],
            600,
            async () => {
                const {totalExperience} = (await Experience.query()
                    .sum('amount as totalExperience')
                    .where('guildId', '=', guildId)
                    .andWhere('userId', '=', userId)
                    .first()) as Experience & {totalExperience: number};

                return totalExperience ?? 0;
            },
        );
    }

    /**
     * Gets the level of user.
     */
    public async getLevel(guildId: string, userId: string): Promise<number> {
        return this.experienceService.xpToLevel(
            await this.getExperience(guildId, userId),
            true,
        );
    }

    /**
     * Sets the experience of user.
     */
    public async setExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<Experience> {
        // Reset the experience first.
        await this.resetExperience(guildId, userId);

        await this.cache.forget(['experience', guildId, userId]);

        // Then add the experience.
        return this.addExperience(guildId, userId, amount);
    }

    /**
     * Adds experience to user.
     */
    public async addExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<Experience> {
        await this.cache.forget(['experience', guildId, userId]);

        return Experience.query().insert({
            amount,
            guildId,
            userId,
        });
    }

    /**
     * Removes experience from user.
     */
    public async removeExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<void> {
        await this.cache.forget(['experience', guildId, userId]);

        await Experience.query().insert({
            amount: -amount,
            guildId,
            userId,
        });
    }

    /**
     * Resets the experience of user.
     */
    public async resetExperience(
        guildId: string,
        userId: string,
    ): Promise<number> {
        const affectedRows = await Experience.query()
            .where('guildId', '=', guildId)
            .andWhere('userId', '=', userId)
            .delete();

        await this.cache.forget(['experience', guildId, userId]);

        return affectedRows;
    }

    /**
     * Gets the leaderboard of guild.
     */
    public async getLeaderboard(
        guildId: string,
        page?: number,
    ): Promise<(Experience & {totalExperience: number})[]> {
        const limit = 25;
        const offset = (page ?? 1) * limit - limit;

        return this.cache.remember(
            ['leaderboard', guildId, page ?? 1],
            600,
            async () => {
                return (await Experience.query()
                    .withGraphFetched({user: true})
                    .where('guildId', '=', guildId)
                    .sum('amount as totalExperience')
                    .groupBy('userId')
                    .orderBy('totalExperience', 'desc')
                    .limit(limit)
                    .offset(offset)) as (Experience & {
                    totalExperience: number;
                })[];
            },
        );
    }

    /**
     * Checks if user is on cooldown for receiving experience.
     */
    public async hasCooldown(
        guildId: string,
        userId: string,
    ): Promise<boolean> {
        const now = dayjs();

        const recentlyReceived = await this.cache.remember(
            ['experience', guildId, userId, 'cooldown'],
            25,
            async () => {
                return await Experience.query()
                    .whereBetween('createdAt', [
                        toMysqlDateTime(now.subtract(30, 'seconds').toDate()),
                        toMysqlDateTime(now.toDate()),
                    ])
                    .where('guildId', '=', guildId)
                    .where('userId', '=', userId)
                    .first();
            },
        );

        return Boolean(recentlyReceived);
    }
}
