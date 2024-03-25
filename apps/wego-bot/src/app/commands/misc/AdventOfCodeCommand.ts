import {wrapInCodeblock} from '@/util/misc/discord';
import {tableWithHead} from '@/util/formatting/table';
import {trans} from '@/util/localization/localization';
import config from '@/config';
import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

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
    public name = 'aoc';
    public description = 'Get the advent of code leaderboard for wego';

    constructor(private logger: Logger) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(config.adventOfCode.leaderboardUrl, {
                headers: {
                    accept: 'application/json',
                    cookie: config.adventOfCode.cookie,
                },
            });

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
            this.logger.fatal('Failed to get advent of code leaderboard', err);
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
