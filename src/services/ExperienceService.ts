import Experience from '@/entities/Experience';
import {Extends} from '@/types/util';
import {toMysqlDateTime} from '@/util/mysql';
import {xpToLevel} from '@/util/xp';
import dayjs from 'dayjs';

export default class ExperienceService {
    /**
     * Gets the experience of the user.
     */
    static async getExperience(
        guildId: string,
        userId: string,
    ): Promise<number> {
        const {totalExperience} = (await Experience.query()
            .sum('amount as totalExperience')
            .where('guildId', '=', guildId)
            .andWhere('userId', '=', userId)
            .first()) as Extends<Experience, {totalExperience: number}>;

        return totalExperience ?? 0;
    }

    /**
     * Gets the level of the user.
     */
    static async getLevel(guildId: string, userId: string): Promise<number> {
        return xpToLevel(
            await ExperienceService.getExperience(guildId, userId),
            true,
        );
    }

    /**
     * Sets the experience of the user.
     */
    static async setExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<Experience> {
        // Reset the experience first.
        await ExperienceService.resetExperience(guildId, userId);

        // Then add the experience.
        return ExperienceService.addExperience(guildId, userId, amount);
    }

    /**
     * Adds experience to the user.
     */
    static async addExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<Experience> {
        return Experience.query().insert({
            amount,
            guildId,
            userId,
        });
    }

    /**
     * Removes experience from the user.
     */
    static async removeExperience(
        guildId: string,
        userId: string,
        amount: number,
    ): Promise<void> {
        await Experience.query().insert({
            amount: -amount,
            guildId,
            userId,
        });
    }

    /**
     * Resets the experience of the user.
     */
    static async resetExperience(
        guildId: string,
        userId: string,
    ): Promise<number> {
        const affectedRows = await Experience.query()
            .where('guildId', '=', guildId)
            .andWhere('userId', '=', userId)
            .delete();

        return affectedRows;
    }

    /**
     * Gets the leaderboard of the guild.
     */
    static async getLeaderboard(
        guildId: string,
    ): Promise<Extends<Experience, {totalExperience: number}>[]> {
        return (await Experience.query()
            .withGraphFetched({user: true})
            .where('guildId', '=', guildId)
            .sum('amount as totalExperience')
            .groupBy('userId')
            .orderBy('totalExperience', 'desc')) as Extends<
            Experience,
            {totalExperience: number}
        >[];
    }

    /**
     * Checks if the user is on cooldown for receiving experience.
     */
    static async isOnCooldown(
        guildId: string,
        userId: string,
    ): Promise<boolean> {
        const now = dayjs();

        const recentlyReceived = await Experience.query()
            .whereBetween('createdAt', [
                toMysqlDateTime(now.subtract(30, 'seconds').toDate()),
                toMysqlDateTime(now.toDate()),
            ])
            .where('guildId', '=', guildId)
            .where('userId', '=', userId)
            .first();

        return Boolean(recentlyReceived);
    }
}
