import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command from '@/commands/Command';
import fetch from 'node-fetch';
import table from 'text-table';
import {Maybe} from '@/types/util';
import {tap} from '@/util/tap';
import Logger from '@/telemetry/logger';
import {i18n} from '@/index';

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

const cache: {content: Maybe<string>; createdAt: number} = {
    content: null,
    createdAt: Date.now(),
};

export const AdventOfCodeCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'aoc',
    description: 'Get the advent of code leaderboard for wego',
    run: async (interaction) => {
        try {
            // Return result from cache if < 1 hour old
            if (
                cache.content &&
                cache.createdAt - Date.now() < 60 * 60 * 1000
            ) {
                logger.debug('Returning result from cache');
                await interaction.reply(cache.content);
                return;
            }

            const request = await fetch(AOC_LEADERBOARD_URL, {
                headers: {
                    accept: 'application/json',
                    cookie: AOC_SESSION_COOKIE,
                },
            });

            const response = (await request.json()) as AOCLeaderboardResponse;

            const rows = [
                ['#', 'Name', 'Stars', 'Local score'],
                ...Object.entries(response.members).map(([key, member]) => [
                    key,
                    member.name,
                    String(member.stars),
                    String(member.local_score),
                ]),
            ];

            const content = tap('```' + table(rows) + '```', (x) => {
                cache.content = x;
            });

            await interaction.reply(content);
        } catch (err) {
            logger.fatal('Could not handle AdventOfCodeCommand', err);
            await interaction.followUp({
                content: i18n.__(
                    'errors.common.failed',
                    'advent of code leaderboard',
                ),
                ephemeral: true,
            });
        }
    },
});
