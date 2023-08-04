import {xpToLevel} from '@/util/xp';
import InternalCommand from '../InternalCommand';
import {EmbedBuilder} from 'discord.js';
import {trans} from '@/util/localization';
import {capitalize} from '@/util/string';
import ExperienceService from '@/services/ExperienceService';

export const ExperienceGetCommand = new InternalCommand({
    run: async (interaction) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const totalExperience = await ExperienceService.getExperience(
            interaction.guild?.id ?? '',
            user.id,
        );
        const level = xpToLevel(totalExperience, true);

        const leaderboardIndex = (
            await ExperienceService.getLeaderboard(interaction.guild?.id ?? '')
        ).findIndex((exp) => {
            return exp.user.id === user.id;
        });

        const embed = new EmbedBuilder()
            .setTitle(
                capitalize(
                    trans('commands.experience.get.embed.title', user.username),
                ),
            )
            .setDescription(
                capitalize(
                    trans(
                        'commands.experience.get.embed.description',
                        user.username,
                        level,
                        totalExperience ?? 0,
                        leaderboardIndex + 1,
                    ),
                ),
            )
            .setThumbnail(user.displayAvatarURL());

        await interaction.followUp({embeds: [embed]});
    },
});
