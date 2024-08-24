import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import Logger from '@wego/logger';
import {safeFetchUser, wrapInCodeblock} from '@/util/misc/discord';
import {trans} from '@/util/localization/localization';
import {tableWithHead} from '@/util/formatting/table';
import {Client} from 'discord.js';
import {injectable} from 'tsyringe';

type Row = {
    userId: string;
    totalReceivedKarma: string;
};

/**
 * Transform db row to table-formatted row
 */
async function dbRowToTableRow(
    row: Row,
    i: number,
    client: Client,
): Promise<string[]> {
    const {username} = await safeFetchUser(client, row.userId);
    return [i + 1, username, row.totalReceivedKarma].map(String);
}

@injectable()
export default class KarmaLeaderboardGetCommand extends BaseInternalCommand {
    constructor(
        private karmaRepository: KarmaRepository,
        private clientService: DiscordClientService,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const results = await this.karmaRepository.getLeaderboard(
                interaction.guildId!,
            );

            const rows = await Promise.all(
                results.map((row, i) =>
                    dbRowToTableRow(row, i, this.clientService.getClient()),
                ),
            );

            await interaction.followUp(
                wrapInCodeblock(
                    tableWithHead(
                        [
                            trans('commands.karma.leaderboard.table.index'),
                            trans('commands.karma.leaderboard.table.user'),
                            trans('commands.karma.leaderboard.table.karma'),
                        ],
                        rows,
                    ),
                ),
            );
        } catch (err) {
            this.logger.fatal('Failed to get karma leaderboard', err);
        }
    }
}
