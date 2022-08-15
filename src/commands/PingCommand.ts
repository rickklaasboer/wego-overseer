import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command from './Command';

export const PingCommand = new Command<ChatInputCommandInteraction<CacheType>>({
    name: 'ping',
    description: 'Ping!',
    run: async (interaction) => {
        await interaction.reply('Pong!');
    },
});
