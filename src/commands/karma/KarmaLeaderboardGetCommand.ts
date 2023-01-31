import Command from '@/commands/Command';
import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {tableWithHead} from '@/util/table';
import {Client} from 'discord.js';

type Row = {
    userId: string;
    totalReceivedKarma: string;
};

/**
 * Fetch user safely from discord
 */
async function safeFetchUser(
    client: Client,
    userId: string,
): Promise<{username: string}> {
    try {
        return await client.users.fetch(userId);
    } catch (err) {
        return {username: userId};
    }
}

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

export const KarmaLeaderboardGetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {db, client}) => {
        // Raw query using knex because generated query by objection
        // would result in a very inefficient query
        const results = (await db
            .table('karma')
            .select('userId')
            .sum('amount as totalReceivedKarma')
            .where('guildId', '=', interaction.guild?.id ?? '')
            .orderBy('totalReceivedKarma', 'desc')
            .groupBy('userId')) as Row[];

        const rows = await Promise.all(
            results.map((row, i) => dbRowToTableRow(row, i, client)),
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
    },
});
