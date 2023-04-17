import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicPauseCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.pause.nothing_playing'),
            );
            return;
        }

        queue.node.pause();

        await interaction.editReply(trans('commands.music.pause.success'));
    },
});
