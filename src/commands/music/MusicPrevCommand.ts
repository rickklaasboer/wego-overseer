import {player} from '@/index';
import Command from '../Command';

export const MusicPrevCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        if (!player || !interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            return;
        }

        if (!queue.previousTracks.length) {
            return;
        }

        await queue.back();

        await interaction.editReply(`Replaying previous track`);
    },
});
