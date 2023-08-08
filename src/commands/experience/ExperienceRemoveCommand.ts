import ExperienceService from '@/services/ExperienceService';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import InternalCommand from '../InternalCommand';

export const ExperienceRemoveCommand = new InternalCommand({
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

        await ExperienceService.removeExperience(guildId, user.id, amount);
        const newExperience = await ExperienceService.getExperience(
            guildId,
            user.id,
        );

        await interaction.followUp(
            trans(
                'commands.experience.remove.success',
                amount,
                user.username,
                newExperience,
            ),
        );
    },
});
