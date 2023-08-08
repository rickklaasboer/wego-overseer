import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Event from '@/events/Event';
import ExperienceService from '@/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:events:ConfirmResetExperienceEvent');

export type ConfirmModalPayload = [string, string, string];

export const ConfirmResetExperienceEvent = new Event({
    name: 'interactionCreate',
    run: async ({client}, interaction) => {
        try {
            if (!interaction.isModalSubmit()) return;

            const [eventType, userId] = interaction.customId.split(
                '|',
            ) as ConfirmModalPayload;

            // Terminate if not a vote button
            if (!eventType.startsWith('XP_RESET')) return;

            const username = interaction.fields.getTextInputValue('name');
            const user = await client.users.fetch(userId);

            await ensureGuildIsAvailable(interaction.guild?.id);
            await ensureUserIsAvailable(user.id);

            if (user.username !== username) {
                await interaction.reply(
                    trans('commands.experience.reset.username_mismatch'),
                );
                return;
            }

            await ExperienceService.resetExperience(
                interaction.guild?.id ?? '',
                userId,
            );

            await interaction.reply(
                trans('commands.experience.reset.success', username),
            );
        } catch (err) {
            logger.error('Unable to handle ConfirmResetExperienceEvent', err);
        }
    },
});
