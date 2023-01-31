import Command from '../Command';

export const MusicStopCommand = new Command({
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

        queue.destroy(true);
        await interaction.editReply(
            'The music has been stopped and queue has been cleared.',
        );
    },
});
