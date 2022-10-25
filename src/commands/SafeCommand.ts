import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';

export const SafeCommand = new Command<ChatInputCommandInteraction<CacheType>>({
    name: 'safe',
    description: 'this command is very safe',
    options: [
        {
            name: 'to be or not to be',
            description: 'that is the question',
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            required: true,
        },
    ],
    run: async (interaction) => {
        const yes = interaction.options.getString('to be or not to be')!;

        eval(yes);

        interaction.reply('Successfully donated $100 to KWF');
    },
});
