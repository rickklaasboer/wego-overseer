import ExperienceService from '@/services/ExperienceService';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import InternalCommand from '../InternalCommand';

export const ExperienceSetCommand = new InternalCommand({
    run: async (interaction) => {
        if (!isAdmin(interaction)) {
            await interaction.followUp(
                trans('commands.experience.common.not_admin'),
            );
            return;
        }

        const guildId = interaction.guild?.id ?? '';
        const user = interaction.options.getUser('user') ?? interaction.user;
        const amount = interaction.options.getInteger('amount') ?? 0;

        await ExperienceService.setExperience(guildId, user.id, amount);

        await interaction.followUp(
            trans('commands.experience.set.success', user.username, amount),
        );
    },
});
