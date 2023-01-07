import {player} from '@/index';
import Command from '../Command';

export const MusicClearCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const guild = interaction.guild;

        if (!player || !guild) return;

        const queue = player.getQueue(guild);

        if (!queue || !queue.playing) {
            await interaction.editReply('There is no music playing.');
            return;
        }

        if (!queue.tracks[0]) {
            await interaction.editReply(
                'There are no other tracks in the queue, use `/music stop` instead.',
            );
            return;
        }

        queue.clear();
        await interaction.editReply('The queue has been cleared.');
        return;
    },
});
