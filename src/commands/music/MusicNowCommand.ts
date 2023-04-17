import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import Command from '../Command';

export const MusicNowCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.currentTrack) {
            await interaction.editReply(
                trans('commands.music.now.nothing_playing'),
            );
            return;
        }

        const requestedBy = queue.currentTrack.requestedBy;
        const embed = new EmbedBuilder()
            .setTitle(trans('commands.music.now.embed.title'))
            .setDescription(
                wrapInCodeblock(
                    queue.currentTrack.title +
                        '\n\n' +
                        queue.node.createProgressBar(),
                ),
            )
            .setFooter({
                text: trans(
                    'commands.music.now.embed.footer.text',
                    requestedBy?.username ?? '',
                ),
                iconURL: requestedBy?.displayAvatarURL(),
            });

        await interaction.editReply({embeds: [embed]});
    },
});
