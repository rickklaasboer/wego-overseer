import {secondsToTime} from '@/util/misc';
import Command from '../Command';

export const MusicSeekCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.getQueue(guild);

        if (!queue || !queue.playing) {
            await interaction.editReply('There is no music playing.');
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const position = interaction.options.getInteger('seconds')!;
        await queue.seek(position);

        const [min, sec] = secondsToTime(position);

        await interaction.editReply(
            `The currently playing song had been seeked to ${min} minutes and ${sec} seconds`,
        );
    },
});
