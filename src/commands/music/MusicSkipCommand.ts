import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicSkipCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.editReply(
                trans('commands.music.skip.nothing_playing'),
            );
            return;
        }

        const prev = queue.current.title;

        queue.skip();

        await interaction.editReply(trans('commands.music.skip.success', prev));
    },
});
