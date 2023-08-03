import {xpToLevel} from '@/util/xp';
import InternalCommand from '../InternalCommand';
import {EmbedBuilder} from 'discord.js';
import {trans} from '@/util/localization';
import {capitalize} from '@/util/string';
import Experience from '@/entities/Experience';

export const ExperienceGetCommand = new InternalCommand({
    run: async (interaction, _self, {db}) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const {totalExperience} = await db
            .table('experience')
            .sum('amount as totalExperience')
            .where('guildId', '=', interaction.guild?.id ?? '')
            .andWhere('userId', '=', user.id)
            .first();

        const level = xpToLevel(totalExperience, true);

        const leaderboardIndex = (
            await Experience.getLeaderboard(interaction.guild?.id ?? '')
        ).findIndex((exp) => {
            return exp.user.id === user.id;
        });

        const embed = new EmbedBuilder()
            .setTitle(
                capitalize(
                    trans('events.experience.get.embed.title', user.username),
                ),
            )
            .setDescription(
                capitalize(
                    trans(
                        'events.experience.get.embed.description',
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
