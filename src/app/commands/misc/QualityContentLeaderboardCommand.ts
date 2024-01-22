import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import config from '@/config';
import KnexService from '@/app/services/KnexService';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import Logger from '@/telemetry/logger';
import StringBuilder from '@/util/StringBuilder';
import {safeFetchUser} from '@/util/discord';
import {t} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import {injectable} from 'tsyringe';

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

@injectable()
export default class QualityContentLeaderboardCommand implements BaseCommand {
    public name = 'ccleaderboard';
    public description = 'Display the quality content leaderboard';

    constructor(
        private clientService: DiscordClientService,
        private knexService: KnexService,
        private logger: Logger,
    ) {}

    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const knex = this.knexService.getKnex();

            const results = (await knex
                .table('karma')
                .select(
                    knex.raw(
                        '*, count(*) as upvotes, SUM(amount) as totalKarma',
                    ),
                )
                .where('guildId', interaction.guildId)
                .groupBy('messageId')
                .having('totalKarma', '>', 0)
                .having('upvotes', '>=', config.qualityContent.minEmojiCount)
                .orderBy('upvotes', 'desc')
                .limit(10)) as Row[];

            if (!results.length) {
                this.logger.info('No results for quality content leaderboard');
                await interaction.reply(
                    t('commands.quality_content.no_results'),
                );
            }

            const sb = new StringBuilder();

            for (const result of results) {
                const user = await safeFetchUser(
                    this.clientService.getClient(),
                    result.userId,
                );

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
            this.logger.fatal('Failed to get quality content leaderboard', err);
            await interaction.reply({
                content: t('errors.common.failed', 'ccleaderboard'),
                ephemeral: true,
            });
        }
    }
}
