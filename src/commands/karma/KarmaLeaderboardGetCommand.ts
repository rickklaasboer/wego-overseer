import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import KarmaRepository from '@/repositories/KarmaRepository';
import DiscordClientService from '@/services/discord/DiscordClientService';
import {safeFetchUser, wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {tableWithHead} from '@/util/table';
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
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const results = await this.karmaRepository.getLeaderboard(
            interaction.guildId!,
        );

        const rows = await Promise.all(
            results.map((row, i) =>
                dbRowToTableRow(row, i, this.clientService.getClient()),
            ),
        );

        await interaction.reply(
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
    }
}
