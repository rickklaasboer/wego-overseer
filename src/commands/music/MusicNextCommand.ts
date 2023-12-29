import {trans} from '@/util/localization';
import Command from '../Command';

export const MusicNextCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            await interaction.editReply(
                trans('commands.music.next.queue_empty'),
            );
            return;
        }

        const query = interaction.options.getString('query')!;
        const requested = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!requested || requested.playlist) {
            await interaction.editReply(
                trans('commands.music.next.playlist_not_allowed'),
            );
            return;
        }

        queue.insertTrack(requested.tracks[0], 0);

        await interaction.editReply(
            trans('commands.music.next.success', requested.tracks[0].title),
        );
    },
});
