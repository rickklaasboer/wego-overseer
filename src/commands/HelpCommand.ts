import Command, {SlashCommandOption} from '@/commands/Command';
import {bot} from '@/index';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';

function commandToTableRow({name, description, options}: Command) {
    return [
        `/${name}`,
        description,
        options?.map(formatCommandArgs).join(' ') ?? 'N/A',
    ];
}

function formatCommandArgs({name, required}: SlashCommandOption): string {
    return `<${name}${required ? '' : '?'}>`;
}

export const HelpCommand = new Command({
    name: 'help',
    description:
        "Shows all of Wego Overseer's commands and describes basic usage",
    run: async (interaction) => {
        if (!bot) return;

        const head = ['Name', 'Description', 'Arguments'];
        const content = wrapInCodeblock(
            tableWithHead(head, bot.getCommands().map(commandToTableRow)),
        );

        await interaction.reply(content);
    },
});
