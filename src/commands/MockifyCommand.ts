import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';

/**
 * Transforms string into 'spongebob case' or 'mocked case'
 */
function mockify(input: string): string {
    return Array.from(input)
        .map((c: string) =>
            Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase(),
        )
        .join('');
}

export const MockifyCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'mockify',
    description: 'transform text to spongebob mocking',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text to be transformed',
            required: true,
            min_length: 1,
        },
    ],
    run: async (interaction) => {
        await interaction.reply(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            mockify(interaction.options.getString('text')!),
        );
    },
});
