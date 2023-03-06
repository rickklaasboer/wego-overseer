import {trans} from '@/util/localization';
import {secondsToTime} from '@/util/misc';
import Command from '../Command';

export const MusicSeekCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.seek.nothing_playing'),
            );
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const position = interaction.options.getInteger('seconds')!;
        await queue.node.seek(position);

        const [min, sec] = secondsToTime(position).map(String);

        await interaction.editReply(
            trans('commands.music.seek.success', min, sec),
        );
    },
});
