import Command from '@/commands/Command';
import {client, db} from '@/index';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';

type Row = {
    userId: string;
    totalReceivedKarma: string;
};

/**
 * Fetch user safely from discord
 */
async function safeFetchUser(userId: string): Promise<{username: string}> {
    try {
        return await client.users.fetch(userId);
    } catch (err) {
        return {username: userId};
    }
}

/**
 * Transform db row to table-formatted row
 */
async function dbRowToTableRow(row: Row, i: number): Promise<string[]> {
    const {username} = await safeFetchUser(row.userId);
    return [i + 1, username, row.totalReceivedKarma].map(String);
}

export const KarmaLeaderboardGetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        // Raw query using knex because generated query by objection
        // would result in a very inefficient query
        const results = (await db
            .table('karma')
            .select('userId')
            .sum('amount as totalReceivedKarma')
            .where('guildId', '=', interaction.guild?.id ?? '')
            .orderBy('totalReceivedKarma', 'desc')
            .groupBy('userId')) as Row[];

        const rows = await Promise.all(results.map(dbRowToTableRow));

        await interaction.reply(
            wrapInCodeblock(tableWithHead(['#', 'User', 'Karma'], rows)),
        );
    },
});
