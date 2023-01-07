import {player} from '@/index';
import Command from '../Command';

export const MusicNextCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        if (!player || !interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue) {
            await interaction.editReply(
                "There's currently no queue, use `/music play` instead.",
            );
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const query = interaction.options.getString('query')!;
        const requested = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!requested || requested.playlist) {
            await interaction.editReply(
                'Cannot add playlist to next position in queue, use `/music play` instead.',
            );
            return;
        }

        queue.insert(requested.tracks[0]);

        await interaction.editReply(
            `Loaded ${requested.tracks[0].title} into the next position in the server queue.`,
        );
    },
});
