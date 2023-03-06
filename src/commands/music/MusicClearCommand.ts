import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicClearCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.nodes.get(guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(trans('commands.music.clear.no_music'));
            return;
        }

        if (queue.tracks.size < 1) {
            await interaction.editReply(
                trans('commands.music.clear.queue_empty'),
            );
            return;
        }

        queue.tracks.clear();

        await interaction.editReply(trans('commands.music.clear.success'));
    },
});
