import Command, {SlashCommandOption} from '@/commands/Command';
import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
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
    run: async (interaction, _, {bot}) => {
        if (!bot) return;

        const head = [
            trans('commands.help.table.name'),
            trans('commands.help.table.description'),
            trans('commands.help.table.arguments'),
        ];

        const content = wrapInCodeblock(
            tableWithHead(head, bot.commands.map(commandToTableRow)),
        );

        await interaction.reply(content);
    },
});
