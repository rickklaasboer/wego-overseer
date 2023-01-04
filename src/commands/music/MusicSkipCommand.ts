import {player} from '@/index';
import Command from '../Command';

export const MusicSkipCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        if (!player || !interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            return;
        }

        const prev = queue.current.title;

        queue.skip();

        await interaction.editReply(`Track ${prev} was skipped.`);
    },
});
