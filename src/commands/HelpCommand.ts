import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command from '@/commands/Command';
import {bot} from '..';

export const HelpCommand = new Command<ChatInputCommandInteraction<CacheType>>({
    name: 'help',
    description: 'pls help!',
    run: async (interaction) => {
        interaction.reply(
            bot
                ?.getCommands()
                .filter(({name}) => name !== 'help')
                .map(({name, description}) => `\`/${name}\` - ${description}`)
                .join('\n') ?? '',
        );
    },
});
