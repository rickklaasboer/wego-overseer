import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {trans} from '@/util/localization';
import config from '@/config';
import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

type AOCLeaderboardResponse = {
    owner_id: string;
    members: {
        [key: string]: {
            name: string;
            global_score: number;
            last_star_ts: number;
            stars: number;
            local_score: number;
            id: number;
        };
    };
};

@injectable()
export default class AdventOfCodeCommand implements BaseCommand {
    name = 'aoc';
    description = 'Get the advent of code leaderboard for wego';

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(
                config.misc.adventOfCode.leaderboardUrl,
                {
                    headers: {
                        accept: 'application/json',
                        cookie: config.misc.adventOfCode.cookie,
                    },
                },
            );

            const response = (await request.json()) as AOCLeaderboardResponse;

            const rows = Object.entries(response.members)
                .map(([key, member]) => [
                    key,
                    member.name,
                    String(member.stars),
                    String(member.local_score),
                ])
                .sort((a, b) => parseInt(b[3]) - parseInt(a[3]));

            const content = wrapInCodeblock(
                tableWithHead(
                    [
                        trans('commands.aoc.table.index'),
                        trans('commands.aoc.table.name'),
                        trans('commands.aoc.table.stars'),
                        trans('commands.aoc.table.local_score'),
                    ],
                    rows,
                ),
            );

            await interaction.reply(content);
        } catch (err) {
            await interaction.reply({
                content: trans(
                    'errors.common.failed',
                    'advent of code leaderboard',
                ),
                ephemeral: true,
            });
        }
    }
}
