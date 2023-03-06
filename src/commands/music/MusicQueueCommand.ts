import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {tableWithHead} from '@/util/table';
import {tap} from '@/util/tap';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import Command from '../Command';

export const MusicQueueCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const embed = new EmbedBuilder();

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            await interaction.editReply(
                trans('commands.music.queue.queue_empty', guild.id),
            );
            return;
        }

        const contents = wrapInCodeblock(
            tableWithHead(
                [
                    trans('commands.music.queue.table.head.position'),
                    trans('commands.music.queue.table.head.title'),
                ],
                queue.tracks.map(({title}, i) => [String(i + 1), title]),
            ),
        );

        const row = tap(new ActionRowBuilder<ButtonBuilder>(), (r) => {
            r.addComponents([
                new ButtonBuilder()
                    .setCustomId('MUSIC_PREV')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_PLAYPAUSE')
                    .setEmoji('⏯️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_STOP')
                    .setEmoji('⏹️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_NEXT')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Secondary),
            ]);
        });

        embed.setDescription(contents);

        await interaction.editReply({embeds: [embed], components: [row]});
    },
});
