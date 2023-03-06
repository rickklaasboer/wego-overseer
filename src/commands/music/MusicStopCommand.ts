import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicStopCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.stop.nothing_playing'),
            );
            return;
        }

        queue.delete();
        await interaction.editReply(trans('commands.music.stop.success'));
    },
});
