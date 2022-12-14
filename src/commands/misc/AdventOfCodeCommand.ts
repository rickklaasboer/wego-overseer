import Command from '@/commands/Command';
import fetch from 'node-fetch';
import Logger from '@/telemetry/logger';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:AdventOfCodeCommand');

const AOC_SESSION_COOKIE = process.env.AOC_SESSION_COOKIE ?? '';
const AOC_LEADERBOARD_URL = process.env.AOC_LEADERBOARD_URL ?? '';

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
                    tableWithHead(['#', 'Name', 'Stars', 'Local score'], rows),
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
