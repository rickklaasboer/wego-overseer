import {player} from '@/index';
import Command from '../Command';

export const MusicPauseCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        if (!player || !interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.editReply('There is currently nothing playing.');
            return;
        }

        queue.setPaused(true);

        await interaction.editReply(`The queue was paused`);
    },
});
