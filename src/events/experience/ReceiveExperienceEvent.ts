import Logger from '@/telemetry/logger';
import Event from '@/events/Event';
import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import {randomInt} from 'crypto';
import ExperienceService from '@/services/ExperienceService';

const logger = new Logger('wego-overseer:events:ReceiveExperienceEvent');

export const ReceiveExperienceEvent = new Event({
    name: 'messageCreate',
    run: async (_ctx, message) => {
        try {
            if (message.author.bot) return;

            await ensureGuildIsAvailable(message.guild?.id);
            await ensureUserIsAvailable(message.author.id);

            const isOnCooldown = await ExperienceService.isOnCooldown(
                message.guild?.id ?? '',
                message.author.id,
            );

            if (isOnCooldown) return;

            await ExperienceService.addExperience(
                message.guild?.id ?? '',
                message.author.id,
                randomInt(5, 15),
            );
        } catch (err) {
            logger.error('Unable to handle ReceiveExperienceEvent', err);
        }
    },
});
