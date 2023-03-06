import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicResumeCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.node.isPaused()) {
            await interaction.editReply(
                trans('commands.music.resume.invalid_queue'),
            );
            return;
        }

        queue.node.resume();

        await interaction.editReply(trans('commands.music.resume.success'));
    },
});
