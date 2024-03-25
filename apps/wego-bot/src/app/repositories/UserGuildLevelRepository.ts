import Cache from '@/app/cache/Cache';
import UserGuildLevel from '@/app/entities/UserGuildLevel';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class UserGuildLevelRepository {
    constructor(
        private experienceRepository: ExperienceRepository,
        private cache: Cache,
    ) {}

    /**
     * Gets the level of user.
     */
    public async getLevel(guildId: string, userId: string): Promise<number> {
        return this.cache.remember(
            ['level', guildId, userId],
            600,
            async () => {
                const result = await UserGuildLevel.query().findById([
                    guildId,
                    userId,
                ]);

                if (!result) {
                    const level = await this.experienceRepository.getLevel(
                        guildId,
                        userId,
                    );
                    await this.setLevel(guildId, userId, level);

                    return level;
                }

                return result.level;
            },
        );
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

        await this.cache.forget(['level', guildId, userId]);

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
        return Boolean(
            await UserGuildLevel.query().findById([guildId, userId]),
        );
    }
}
