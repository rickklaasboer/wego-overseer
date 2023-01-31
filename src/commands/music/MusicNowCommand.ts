import {wrapInCodeblock} from '@/util/discord';
import {EmbedBuilder} from 'discord.js';
import Command from '../Command';

export const MusicNowCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);
        if (!queue || !queue.current) {
            await interaction.editReply('There is currently nothing playing.');
            return;
        }

        const embed = new EmbedBuilder()
            .setTitle('Currently playing')
            .setDescription(
                wrapInCodeblock(
                    queue.current.title + '\n\n' + queue.createProgressBar(),
                ),
            )
            .setFooter({
                text: `Requested by ${queue.current.requestedBy.username}`,
                iconURL: queue.current.requestedBy.displayAvatarURL(),
            });

        await interaction.editReply({embeds: [embed]});
    },
});
