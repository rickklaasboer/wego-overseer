import Command from '../Command';

export const MusicPrevCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        if (!interaction.guild) return;

        const queue = player.getQueue(interaction.guild);

        if (!queue || !queue.playing) {
            await interaction.editReply('There is currently nothing playing.');
            return;
        }

        if (!queue.previousTracks.length) {
            await interaction.editReply('There is no previous entry in queue');
            return;
        }

        await queue.back();

        await interaction.editReply(`Replaying previous track`);
    },
});
