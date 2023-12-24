import Command from '@/commands/Command';
import Logger from '@/telemetry/logger';
import StringBuilder from '@/util/StringBuilder';
import {safeFetchUser} from '@/util/discord';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';

const logger = new Logger(
    'wego-overseer:commands:QualityContentLeaderboardCommand',
);

type Row = {
    id: string;
    amount: number;
    messageId: string;
    guildId: string;
    userId: string;
    receivedFromUserId: string;
    channelId: string;
    createdAt: Date;
    updatedAt: Date | null;
    upvotes: number;
    totalKarma: number;
};

export const QualityContentLeaderboardCommand = new Command({
    name: 'ccleaderboard',
    description: 'Display the quality content leaderboard',
    run: async (interaction, _, {db, client}) => {
        try {
            const results = (await db
                .table('karma')
                .select(
                    db.raw('*, count(*) as upvotes, SUM(amount) as totalKarma'),
                )
                .groupBy('messageId')
                .having('totalKarma', '>', 0)
                .having('upvotes', '>=', 5)
                .orderBy('upvotes', 'desc')
                .limit(10)) as Row[];

            if (!results.length) {
                await interaction.reply('No results found!');
            }

            const sb = new StringBuilder();

            for (const result of results) {
                sb.append(
                    `Message by ${await safeFetchUser(
                        client,
                        result.userId,
                    )} **${result.upvotes}** upvotes: <#${
                        result.channelId
                    }> - [link](https://discord.com/channels/${
                        result.guildId
                    }/${result.channelId}/${result.messageId})\n\n`,
                );
            }

            const embed = new EmbedBuilder();
            embed.setTitle('Quality Content Leaderboard (Top 10)');
            embed.setDescription(sb.toString());

            await interaction.reply({embeds: [embed]});
        } catch (err) {
            await interaction.reply({
                content: trans('errors.common.failed', 'ccleaderboard'),
                ephemeral: true,
            });
            logger.fatal(
                'Unable to handle QualityContentLeaderboardCommand',
                err,
            );
        }
    },
});
