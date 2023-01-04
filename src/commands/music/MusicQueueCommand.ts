import {player} from '@/index';
import {wrapInCodeblock} from '@/util/discord';
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
    run: async (interaction) => {
        const guild = interaction.guild;

        if (!player || !guild) return;

        const embed = new EmbedBuilder();

        const queue = player.getQueue(guild);

        if (!queue) {
            await interaction.editReply(`${guild.id} has no song(s) queue`);
            return;
        }

        const contents = wrapInCodeblock(
            tableWithHead(
                ['#', 'Title'],
                queue.tracks.map(({title}, i) => [String(i + 1), title]),
            ),
        );

        const row = tap(new ActionRowBuilder<ButtonBuilder>(), (r) => {
            r.addComponents([
                new ButtonBuilder()
                    .setCustomId('music_prev')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('music_play_pause')
                    .setEmoji('⏯️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('music_stop')
                    .setEmoji('⏹️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('music_next')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Secondary),
            ]);
        });

        embed.setDescription(contents);

        await interaction.editReply({embeds: [embed], components: [row]});
    },
});
