import Command, {
    APPLICATION_COMMAND_OPTIONS,
    SlashCommandOption,
} from '@/commands/Command';
import Logger from '@/telemetry/logger';
import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {tableWithHead} from '@/util/table';

const logger = new Logger('wego-overseer:HelpCommand');

const COMMANDS_PER_PAGE = 6;

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
    options: [
        {
            name: 'page',
            description: 'Page to show',
            type: APPLICATION_COMMAND_OPTIONS.INTEGER,
        },
    ],
    run: async (interaction, _, {bot}) => {
        try {
            if (!bot) return;

            const page = interaction.options.getInteger('page') ?? 1;
            const maxPages = Math.floor(bot.commands.size / COMMANDS_PER_PAGE);

            if (page > maxPages) {
                await interaction.reply({
                    content: trans(
                        'commands.help.pagination.page_to_big',
                        String(page),
                    ),
                    ephemeral: true,
                });
                return;
            }

            const head = [
                trans('commands.help.table.name'),
                trans('commands.help.table.description'),
                trans('commands.help.table.arguments'),
            ];

            const rows = Array.from(bot.commands.values())
                .slice((page - 1) * COMMANDS_PER_PAGE, page * COMMANDS_PER_PAGE)
                .map(commandToTableRow);

            const content = wrapInCodeblock(tableWithHead(head, rows));

            trans('commands.help.pagination', String(page), String(maxPages));

            await interaction.reply(
                `${trans(
                    'commands.help.pagination.meta',
                    String(page),
                    String(maxPages),
                )}\n\n${content}`,
            );
        } catch (err) {
            logger.fatal('Unable to handle HelpCommand', err);
            await interaction.reply({
                content: trans('errors.common.command.unknown_error'),
                ephemeral: true,
            });
        }
    },
});
