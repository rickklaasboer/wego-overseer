import {EmbedBuilder} from 'discord.js';
import InternalCommand from '../InternalCommand';
import {safeFetchUser, wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {xpToLevel} from '@/util/xp';
import ExperienceService from '@/services/ExperienceService';

export const ExperienceLeaderboardCommand = new InternalCommand({
    run: async (interaction, _self, {client}) => {
        const rows = await ExperienceService.getLeaderboard(
            interaction.guild?.id ?? '',
        );

        const description = wrapInCodeblock(
            tableWithHead(
                ['#', 'User', 'Level', 'Experience'],
                await Promise.all(
                    rows.map(async (row, i) => {
                        const {username} = await safeFetchUser(
                            client,
                            row.user.id,
                        );

                        return [
                            i + 1,
                            username,
                            xpToLevel(row.totalExperience, true),
                            row.totalExperience,
                        ];
                    }),
                ),
            ),
        );

        const embed = new EmbedBuilder()
            .setTitle(`${interaction.guild?.name}'s Leaderboard`)
            .setThumbnail(interaction.guild?.iconURL() ?? '')
            .setDescription(description);

        await interaction.followUp({embeds: [embed]});
    },
});
