import {isAdmin} from '@/util/discord';
import InternalCommand from '../InternalCommand';
import {trans} from '@/util/localization';
import ExperienceService from '@/services/ExperienceService';

export const ExperienceAddCommand = new InternalCommand({
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

        await ExperienceService.addExperience(guildId, user.id, amount);
        const newExperience = await ExperienceService.getExperience(
            guildId,
            user.id,
        );

        await interaction.followUp(
            trans(
                'commands.experience.add.success',
                user.username,
                amount,
                newExperience,
            ),
        );
    },
});
