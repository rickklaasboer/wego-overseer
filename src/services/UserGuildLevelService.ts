import UserGuildLevel from '@/entities/UserGuildLevel';

export default class UserGuildLevelService {
    /**
     * Gets the level of the user.
     */
    static async getLevel(guildId: string, userId: string): Promise<number> {
        const result = await UserGuildLevel.query().findById([guildId, userId]);

        if (result instanceof UserGuildLevel) {
            return result.level;
        }

        return 0;
    }

    /**
     * Sets the level of the user.
     */
    static async setLevel(
        guildId: string,
        userId: string,
        level: number,
    ): Promise<void> {
        const hasLevel = await UserGuildLevelService.hasLevel(guildId, userId);

        if (!hasLevel) {
            await UserGuildLevel.query().insert({
                guildId,
                userId,
                level,
            });
        } else {
            await UserGuildLevel.query()
                .where('guildId', guildId)
                .andWhere('userId', userId)
                .patch({level});
        }
    }

    /**
     * Checks if user has level.
     */
    static async hasLevel(guildId: string, userId: string): Promise<boolean> {
        return (
            (await UserGuildLevel.query().findById([
                guildId,
                userId,
            ])) instanceof UserGuildLevel
        );
    }
}
