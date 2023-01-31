import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicPrevCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.editReply(
                trans('commands.music.prev.nothing_playing'),
            );
            return;
        }

        if (!queue.previousTracks.length) {
            await interaction.editReply(
                trans('commands.music.prev.no_previous_entry'),
            );
            return;
        }

        await queue.back();

        await interaction.editReply(trans('commands.music.prev.success'));
    },
});
