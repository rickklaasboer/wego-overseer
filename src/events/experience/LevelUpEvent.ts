import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Event from '@/events/Event';
import ExperienceService from '@/services/ExperienceService';
import UserGuildLevelService from '@/services/UserGuildLevelService';
import Logger from '@/telemetry/logger';
import {xpToLevel} from '@/util/xp';

const logger = new Logger('wego-overseer:events:LevelUpEvent');

export const LevelUpEvent = new Event({
    name: 'messageCreate',
    run: async (_ctx, message) => {
        try {
            if (message.author.bot) return;

            const guildId = message.guild?.id ?? '';
            const userId = message.author.id ?? '';

            await ensureGuildIsAvailable(guildId);
            await ensureUserIsAvailable(userId);

            const level = await UserGuildLevelService.getLevel(guildId, userId);
            const experience = await ExperienceService.getExperience(
                guildId,
                userId,
            );

            const newLevel = xpToLevel(experience, true);

            if (newLevel > level) {
                await UserGuildLevelService.setLevel(guildId, userId, newLevel);
            }
        } catch (err) {
            logger.error('Unable to handle LevelUpEvent', err);
        }
    },
});
