import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicPauseCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.editReply(
                trans('commands.music.pause.nothing_playing'),
            );
            return;
        }

        queue.setPaused(true);

        await interaction.editReply(trans('commands.music.pause.success'));
    },
});
