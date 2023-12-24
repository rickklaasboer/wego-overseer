import Command from '@/commands/Command';
import Logger from '@/telemetry/logger';
import StringBuilder from '@/util/StringBuilder';
import {safeFetchUser} from '@/util/discord';
import {getEnvInt} from '@/util/environment';
import {t} from '@/util/localization';
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

const QCC_MIN_EMOJI_COUNT = getEnvInt('QCC_MIN_EMOJI_COUNT', 5);

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
                .where('guildId', interaction.guildId)
                .groupBy('messageId')
                .having('totalKarma', '>', 0)
                .having('upvotes', '>=', QCC_MIN_EMOJI_COUNT)
                .orderBy('upvotes', 'desc')
                .limit(10)) as Row[];

            if (!results.length) {
                await interaction.reply(
                    t('commands.quality_content.no_results'),
                );
            }

            const sb = new StringBuilder();

            for (const result of results) {
                const user = await safeFetchUser(client, result.userId);

                sb.append(
                    t(
                        'commands.quality_content.embed.row',
                        user.username,
                        String(result.upvotes),
                        result.channelId,
                        result.guildId,
                        result.channelId,
                        result.messageId,
                    ),
                );
            }

            const embed = new EmbedBuilder();
            embed.setTitle(t('commands.quality_content.embed.title'));
            embed.setDescription(sb.toString());

            await interaction.reply({embeds: [embed]});
        } catch (err) {
            await interaction.reply({
                content: t('errors.common.failed', 'ccleaderboard'),
                ephemeral: true,
            });
            logger.fatal(
                'Unable to handle QualityContentLeaderboardCommand',
                err,
            );
        }
    },
});
