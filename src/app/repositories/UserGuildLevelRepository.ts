import UserGuildLevel from '@/app/entities/UserGuildLevel';
import {injectable} from 'tsyringe';

@injectable()
export default class UserGuildLevelRepository {
    /**
     * Gets the level of user.
     */
    public async getLevel(guildId: string, userId: string): Promise<number> {
        const result = await UserGuildLevel.query().findById([guildId, userId]);

        if (result instanceof UserGuildLevel) {
            return result.level;
        }

        return 0;
    }

    /**
     * Sets the level of user.
     */
    public async setLevel(
        guildId: string,
        userId: string,
        level: number,
    ): Promise<void> {
        const hasLevel = await this.hasLevel(guildId, userId);

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
    public async hasLevel(guildId: string, userId: string): Promise<boolean> {
        return (
            (await UserGuildLevel.query().findById([
                guildId,
                userId,
            ])) instanceof UserGuildLevel
        );
    }
}
