import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';
import {EmbedBuilder} from 'discord.js';

type KarmaStats = {
    totalReceived: number;
    totalGiven: number;
    uniqueGivers: number;
    uniqueReceivers: number;
    averageReceived: number;
    averageGiven: number;
    favoriteChannel: string | null;
    topGiver: string | null;
    topReceiver: string | null;
    karmaRatio: number;
};

type PersonalityProfile = {
    type: string;
    title: string;
    description: string;
    emoji: string;
    color: number;
    traits: string[];
};

@injectable()
export default class KarmaPersonalityCommand extends BaseInternalCommand {
    constructor(
        private karmaRepository: KarmaRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const user =
                interaction.options.getUser('user') ?? interaction.user;
            const guildId = interaction.guildId!;

            // Get comprehensive karma statistics
            const stats = await this.getKarmaStats(guildId, user.id);

            // Generate personality profile
            const profile = this.generatePersonalityProfile(stats);

            // Create embed
            const embed = new EmbedBuilder()
                .setTitle(
                    `${profile.emoji} ${trans('commands.karma.personality.embed.title', user.username)}`,
                )
                .setDescription(
                    `**${profile.title}**\n\n${profile.description}`,
                )
                .setColor(profile.color)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    {
                        name: trans('commands.karma.personality.fields.stats'),
                        value: this.formatStats(stats),
                        inline: true,
                    },
                    {
                        name: trans('commands.karma.personality.fields.traits'),
                        value: profile.traits
                            .map((trait) => `• ${trait}`)
                            .join('\n'),
                        inline: true,
                    },
                    {
                        name: trans('commands.karma.personality.fields.facts'),
                        value: this.generateFunFacts(stats),
                        inline: false,
                    },
                )
                .setFooter({
                    text: trans(
                        'commands.karma.personality.embed.footer',
                        profile.type,
                    ),
                    iconURL: interaction.client.user?.displayAvatarURL(),
                });

            await interaction.followUp({embeds: [embed]});
        } catch (err) {
            this.logger.fatal(
                'Failed to generate karma personality profile',
                err,
            );
            await interaction.followUp(
                trans(
                    'commands.karma.personality.error',
                    'Failed to generate personality profile',
                ),
            );
        }
    }

    private async getKarmaStats(
        guildId: string,
        userId: string,
    ): Promise<KarmaStats> {
        const received = await this.karmaRepository.getKarmaReceived(
            guildId,
            userId,
        );
        const given = await this.karmaRepository.getKarmaGiven(guildId, userId);
        const uniqueGivers = await this.karmaRepository.getUniqueGivers(
            guildId,
            userId,
        );
        const uniqueReceivers = await this.karmaRepository.getUniqueReceivers(
            guildId,
            userId,
        );
        const favoriteChannel = await this.karmaRepository.getFavoriteChannel(
            guildId,
            userId,
        );
        const topGiver = await this.karmaRepository.getTopGiver(
            guildId,
            userId,
        );
        const topReceiver = await this.karmaRepository.getTopReceiver(
            guildId,
            userId,
        );

        return {
            totalReceived: received.total || 0,
            totalGiven: given.total || 0,
            uniqueGivers: uniqueGivers.count || 0,
            uniqueReceivers: uniqueReceivers.count || 0,
            averageReceived: received.average || 0,
            averageGiven: given.average || 0,
            favoriteChannel: favoriteChannel?.channelId || null,
            topGiver: topGiver?.username || null,
            topReceiver: topReceiver?.username || null,
            karmaRatio: received.total > 0 ? given.total / received.total : 0,
        };
    }

    private generatePersonalityProfile(stats: KarmaStats): PersonalityProfile {
        const {
            totalReceived,
            totalGiven,
            karmaRatio,
            uniqueGivers,
            uniqueReceivers,
        } = stats;

        if (karmaRatio > 2 && totalGiven > 50) {
            return {
                type: 'THE_PHILANTHROPIST',
                title: trans(
                    'commands.karma.personality.types.philanthropist.title',
                ),
                description: trans(
                    'commands.karma.personality.types.philanthropist.description',
                ),
                emoji: '🎁',
                color: 0x00ff00,
                traits: [
                    trans(
                        'commands.karma.personality.types.philanthropist.traits.1',
                    ),
                    trans(
                        'commands.karma.personality.types.philanthropist.traits.2',
                    ),
                    trans(
                        'commands.karma.personality.types.philanthropist.traits.3',
                    ),
                    trans(
                        'commands.karma.personality.types.philanthropist.traits.4',
                    ),
                ],
            };
        } else if (karmaRatio < 0.5 && totalReceived > 100) {
            return {
                type: 'THE_MAGNET',
                title: trans('commands.karma.personality.types.magnet.title'),
                description: trans(
                    'commands.karma.personality.types.magnet.description',
                ),
                emoji: '🧲',
                color: 0xff6b6b,
                traits: [
                    trans('commands.karma.personality.types.magnet.traits.1'),
                    trans('commands.karma.personality.types.magnet.traits.2'),
                    trans('commands.karma.personality.types.magnet.traits.3'),
                    trans('commands.karma.personality.types.magnet.traits.4'),
                ],
            };
        } else if (Math.abs(karmaRatio - 1) < 0.3 && totalGiven > 20) {
            return {
                type: 'THE_BALANCED',
                title: trans('commands.karma.personality.types.balanced.title'),
                description: trans(
                    'commands.karma.personality.types.balanced.description',
                ),
                emoji: '⚖️',
                color: 0x4ecdc4,
                traits: [
                    trans('commands.karma.personality.types.balanced.traits.1'),
                    trans('commands.karma.personality.types.balanced.traits.2'),
                    trans('commands.karma.personality.types.balanced.traits.3'),
                    trans('commands.karma.personality.types.balanced.traits.4'),
                ],
            };
        } else if (uniqueGivers > 10 && uniqueReceivers > 10) {
            return {
                type: 'THE_NETWORKER',
                title: trans(
                    'commands.karma.personality.types.networker.title',
                ),
                description: trans(
                    'commands.karma.personality.types.networker.description',
                ),
                emoji: '🕸️',
                color: 0x9b59b6,
                traits: [
                    trans(
                        'commands.karma.personality.types.networker.traits.1',
                    ),
                    trans(
                        'commands.karma.personality.types.networker.traits.2',
                    ),
                    trans(
                        'commands.karma.personality.types.networker.traits.3',
                    ),
                    trans(
                        'commands.karma.personality.types.networker.traits.4',
                    ),
                ],
            };
        } else if (totalGiven < 5 && totalReceived < 5) {
            return {
                type: 'THE_MYSTERY',
                title: trans('commands.karma.personality.types.mystery.title'),
                description: trans(
                    'commands.karma.personality.types.mystery.description',
                ),
                emoji: '🎭',
                color: 0x95a5a6,
                traits: [
                    trans('commands.karma.personality.types.mystery.traits.1'),
                    trans('commands.karma.personality.types.mystery.traits.2'),
                    trans('commands.karma.personality.types.mystery.traits.3'),
                    trans('commands.karma.personality.types.mystery.traits.4'),
                ],
            };
        } else if (karmaRatio > 1.5) {
            return {
                type: 'THE_GIVER',
                title: trans('commands.karma.personality.types.giver.title'),
                description: trans(
                    'commands.karma.personality.types.giver.description',
                ),
                emoji: '💝',
                color: 0xf39c12,
                traits: [
                    trans('commands.karma.personality.types.giver.traits.1'),
                    trans('commands.karma.personality.types.giver.traits.2'),
                    trans('commands.karma.personality.types.giver.traits.3'),
                    trans('commands.karma.personality.types.giver.traits.4'),
                ],
            };
        } else {
            return {
                type: 'THE_APPRECIATED',
                title: trans(
                    'commands.karma.personality.types.appreciated.title',
                ),
                description: trans(
                    'commands.karma.personality.types.appreciated.description',
                ),
                emoji: '🌟',
                color: 0xe74c3c,
                traits: [
                    trans(
                        'commands.karma.personality.types.appreciated.traits.1',
                    ),
                    trans(
                        'commands.karma.personality.types.appreciated.traits.2',
                    ),
                    trans(
                        'commands.karma.personality.types.appreciated.traits.3',
                    ),
                    trans(
                        'commands.karma.personality.types.appreciated.traits.4',
                    ),
                ],
            };
        }
    }

    private formatStats(stats: KarmaStats): string {
        const lines = [
            trans('commands.karma.personality.stats.given', stats.totalGiven),
            trans(
                'commands.karma.personality.stats.received',
                stats.totalReceived,
            ),
            trans(
                'commands.karma.personality.stats.ratio',
                stats.karmaRatio.toFixed(2),
            ),
            trans(
                'commands.karma.personality.stats.network',
                stats.uniqueGivers + stats.uniqueReceivers,
            ),
        ];
        return lines.join('\n');
    }

    private generateFunFacts(stats: KarmaStats): string {
        const facts = [];

        if (stats.favoriteChannel) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.favorite_channel',
                    stats.favoriteChannel,
                ),
            );
        }

        if (stats.topGiver) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.top_giver',
                    stats.topGiver,
                ),
            );
        }

        if (stats.topReceiver) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.top_receiver',
                    stats.topReceiver,
                ),
            );
        }

        if (stats.karmaRatio > 3) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.high_ratio',
                    Math.round(stats.karmaRatio),
                ),
            );
        }

        if (stats.uniqueGivers > 15) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.many_admirers',
                    stats.uniqueGivers,
                ),
            );
        }

        if (stats.totalGiven + stats.totalReceived > 500) {
            facts.push(
                trans(
                    'commands.karma.personality.facts.high_activity',
                    stats.totalGiven + stats.totalReceived,
                ),
            );
        }

        return facts.length > 0
            ? facts.join('\n')
            : trans('commands.karma.personality.facts.building_history');
    }
}
