import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicSeekCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            await interaction.editReply(
                trans('commands.music.shuffle.nothing_playing'),
            );
            return;
        }

        // Shuffle tracks in queue
        queue.tracks.shuffle();

        await interaction.editReply(trans('commands.music.shuffle.success'));
    },
});
