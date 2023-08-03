import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Event from '@/events/Event';
import ExperienceService from '@/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {xpToLevel} from '@/util/xp';

const logger = new Logger('wego-overseer:events:LevelUpEvent');

export const LevelUpEvent = new Event({
    name: 'messageCreate',
    run: async ({db}, message) => {
        try {
            if (message.author.bot) return;

            await ensureGuildIsAvailable(message.guild?.id);
            await ensureUserIsAvailable(message.author.id);

            const [guildId, userId] = [
                message.guild?.id ?? '',
                message.author.id ?? '',
            ];

            await db
                .table('user_guild_level')
                .insert({
                    guildId,
                    userId,
                    level: 0,
                })
                .onConflict(['guildId', 'userId'])
                .ignore();

            const {level} = await db
                .table('user_guild_level')
                .select('*')
                .where('guildId', '=', guildId)
                .andWhere('userId', '=', userId)
                .first();

            const totalExperience = await ExperienceService.getExperience(
                guildId,
                userId,
            );

            const newLevel = xpToLevel(totalExperience, true);

            if (newLevel > level) {
                logger.debug(
                    `User ${message.author.username} in guild ${message.guild?.name} leveled up to level ${newLevel} from level ${level}`,
                );
                await db
                    .table('user_guild_level')
                    .update({level: newLevel})
                    .where('guildId', '=', guildId)
                    .andWhere('userId', '=', userId);
            }
        } catch (err) {
            logger.error('Unable to handle LevelUpEvent', err);
        }
    },
});
