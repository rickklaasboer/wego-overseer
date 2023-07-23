import Command from '@/commands/Command';
import Logger from '@/telemetry/logger';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {trans} from '@/util/localization';
import {getEnvString} from '@/util/environment';

const logger = new Logger('wego-overseer:commands:AdventOfCodeCommand');

const AOC_SESSION_COOKIE = getEnvString('AOC_SESSION_COOKIE', '');
const AOC_LEADERBOARD_URL = getEnvString('AOC_LEADERBOARD_URL', '');

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

export const AdventOfCodeCommand = new Command({
    name: 'aoc',
    description: 'Get the advent of code leaderboard for wego',
    run: async (interaction) => {
        try {
            const request = await fetch(AOC_LEADERBOARD_URL, {
                headers: {
                    accept: 'application/json',
                    cookie: AOC_SESSION_COOKIE,
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

            await interaction.reply(
                wrapInCodeblock(
                    tableWithHead(
                        [
                            trans('commands.aoc.table.index'),
                            trans('commands.aoc.table.name'),
                            trans('commands.aoc.table.stars'),
                            trans('commands.aoc.table.local_score'),
                        ],
                        rows,
                    ),
                ),
            );
        } catch (err) {
            logger.fatal('Could not handle AdventOfCodeCommand', err);
            await interaction.reply({
                content: trans(
                    'errors.common.failed',
                    'advent of code leaderboard',
                ),
                ephemeral: true,
            });
        }
    },
});
