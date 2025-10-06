import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';
import {EmbedBuilder} from 'discord.js';

interface KarmaStats {
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
}

interface PersonalityProfile {
    type: string;
    title: string;
    description: string;
    emoji: string;
    color: number;
    traits: string[];
}

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
                    `${profile.emoji} ${user.username}'s Karma Personality`,
                )
                .setDescription(
                    `**${profile.title}**\n\n${profile.description}`,
                )
                .setColor(profile.color)
                .setThumbnail(user.displayAvatarURL())
                .addFields(
                    {
                        name: '📊 Karma Stats',
                        value: this.formatStats(stats),
                        inline: true,
                    },
                    {
                        name: '🎯 Personality Traits',
                        value: profile.traits
                            .map((trait) => `• ${trait}`)
                            .join('\n'),
                        inline: true,
                    },
                    {
                        name: '🏆 Fun Facts',
                        value: this.generateFunFacts(stats),
                        inline: false,
                    },
                )
                .setFooter({
                    text: `Karma Personality Type: ${profile.type}`,
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
        // You'll need to implement these methods in your KarmaRepository
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
            favoriteChannel: favoriteChannel?.name || null,
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

        // Determine personality type based on karma patterns
        if (karmaRatio > 2 && totalGiven > 50) {
            return {
                type: 'THE_PHILANTHROPIST',
                title: 'The Karma Philanthropist',
                description:
                    "You're the generous soul of the server! You give way more karma than you receive, spreading positivity wherever you go.",
                emoji: '🎁',
                color: 0x00ff00,
                traits: [
                    'Extremely generous',
                    'Community focused',
                    'Natural encourager',
                    'Selfless helper',
                ],
            };
        } else if (karmaRatio < 0.5 && totalReceived > 100) {
            return {
                type: 'THE_MAGNET',
                title: 'The Karma Magnet',
                description:
                    "You're a karma magnet! People love giving you karma - you must be doing something really right!",
                emoji: '🧲',
                color: 0xff6b6b,
                traits: [
                    'Highly appreciated',
                    'Content creator',
                    'Community favorite',
                    'Natural entertainer',
                ],
            };
        } else if (Math.abs(karmaRatio - 1) < 0.3 && totalGiven > 20) {
            return {
                type: 'THE_BALANCED',
                title: 'The Karma Balancer',
                description:
                    'Perfect harmony! You give and receive karma in beautiful balance. You understand the true spirit of karma.',
                emoji: '⚖️',
                color: 0x4ecdc4,
                traits: [
                    'Well-balanced',
                    'Fair and just',
                    'Reciprocal nature',
                    'Karma philosopher',
                ],
            };
        } else if (uniqueGivers > 10 && uniqueReceivers > 10) {
            return {
                type: 'THE_NETWORKER',
                title: 'The Karma Networker',
                description:
                    "You're connected! You exchange karma with lots of different people - a true social butterfly of the server.",
                emoji: '🕸️',
                color: 0x9b59b6,
                traits: [
                    'Highly social',
                    'Great networker',
                    'Community connector',
                    'Relationship builder',
                ],
            };
        } else if (totalGiven < 5 && totalReceived < 5) {
            return {
                type: 'THE_MYSTERY',
                title: 'The Karma Mystery',
                description:
                    "You're an enigma! Still building your karma story. Every journey starts with a single step.",
                emoji: '🎭',
                color: 0x95a5a6,
                traits: [
                    'Mysterious presence',
                    'Untapped potential',
                    'Fresh start',
                    'Future legend',
                ],
            };
        } else if (karmaRatio > 1.5) {
            return {
                type: 'THE_GIVER',
                title: 'The Karma Giver',
                description:
                    'You have a giving heart! You love to spread karma and make others feel appreciated.',
                emoji: '💝',
                color: 0xf39c12,
                traits: [
                    'Generous spirit',
                    'Appreciation spreader',
                    'Positive influence',
                    'Heart of gold',
                ],
            };
        } else {
            return {
                type: 'THE_APPRECIATED',
                title: 'The Karma Appreciated',
                description:
                    "You're well-loved by the community! People recognize your contributions and show their appreciation.",
                emoji: '🌟',
                color: 0xe74c3c,
                traits: [
                    'Well-respected',
                    'Valued member',
                    'Positive contributor',
                    'Community treasure',
                ],
            };
        }
    }

    private formatStats(stats: KarmaStats): string {
        const lines = [
            `**Given:** ${stats.totalGiven}`,
            `**Received:** ${stats.totalReceived}`,
            `**Ratio:** ${stats.karmaRatio.toFixed(2)}`,
            `**Network:** ${stats.uniqueGivers + stats.uniqueReceivers} people`,
        ];
        return lines.join('\n');
    }

    private generateFunFacts(stats: KarmaStats): string {
        const facts = [];

        if (stats.favoriteChannel) {
            facts.push(`🏠 Most active in #${stats.favoriteChannel}`);
        }

        if (stats.topGiver) {
            facts.push(`🎯 Biggest karma fan: ${stats.topGiver}`);
        }

        if (stats.topReceiver) {
            facts.push(`💖 Favorite karma target: ${stats.topReceiver}`);
        }

        if (stats.karmaRatio > 3) {
            facts.push(
                `🎁 Gives ${Math.round(stats.karmaRatio)}x more than receives!`,
            );
        }

        if (stats.uniqueGivers > 15) {
            facts.push(
                `🌍 Has ${stats.uniqueGivers} different karma admirers!`,
            );
        }

        if (stats.totalGiven + stats.totalReceived > 500) {
            facts.push(
                `🚀 Total karma activity: ${stats.totalGiven + stats.totalReceived}!`,
            );
        }

        return facts.length > 0
            ? facts.join('\n')
            : 'Building karma history...';
    }
}
