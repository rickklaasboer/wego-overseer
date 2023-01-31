import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import Command from '../Command';

export const MusicNowCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);
        if (!queue || !queue.current) {
            await interaction.editReply(
                trans('commands.music.now.nothing_playing'),
            );
            return;
        }

        const requestedBy = queue.current.requestedBy;
        const embed = new EmbedBuilder()
            .setTitle(trans('commands.music.now.embed.title'))
            .setDescription(
                wrapInCodeblock(
                    queue.current.title + '\n\n' + queue.createProgressBar(),
                ),
            )
            .setFooter({
                text: trans(
                    'commands.music.now.embed.footer.text',
                    requestedBy.username,
                ),
                iconURL: requestedBy.displayAvatarURL(),
            });

        await interaction.editReply({embeds: [embed]});
    },
});
