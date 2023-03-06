import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicSkipCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.skip.nothing_playing'),
            );
            return;
        }

        const prev = queue.currentTrack?.title;

        queue.node.skip();

        if (!prev) return;

        await interaction.editReply(trans('commands.music.skip.success', prev));
    },
});
