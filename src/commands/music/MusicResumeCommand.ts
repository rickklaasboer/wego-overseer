import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicResumeCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.connection.paused) {
            await interaction.editReply(
                trans('commands.music.resume.invalid_queue'),
            );
            return;
        }

        queue.setPaused(false);

        await interaction.editReply(trans('commands.music.resume.success'));
    },
});
