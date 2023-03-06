import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicPrevCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.prev.nothing_playing'),
            );
            return;
        }

        if (queue.history.isEmpty()) {
            await interaction.editReply(
                trans('commands.music.prev.no_previous_entry'),
            );
            return;
        }

        await queue.history.back();

        await interaction.editReply(trans('commands.music.prev.success'));
    },
});
