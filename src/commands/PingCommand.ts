import Command from '@/commands/Command';

export const PingCommand = new Command({
    name: 'ping',
    description: 'Ping!',
    run: async (interaction) => {
        await interaction.reply(
            `Pong! (${Math.abs(Date.now() - interaction.createdTimestamp)} ms)`,
        );
    },
});
