import {player} from '@/index';
import Command from '../Command';

export const MusicResumeCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        if (!player || !interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.connection.paused) {
            await interaction.editReply(
                "There is currently no queue of it's not paused.",
            );
            return;
        }

        queue.setPaused(false);

        await interaction.editReply(`The queue has been resumed`);
    },
});
