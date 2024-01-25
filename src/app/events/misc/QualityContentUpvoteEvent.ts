import {
    Channel,
    EmbedBuilder,
    GuildEmoji,
    Message,
    MessageReaction,
    PartialMessage,
} from 'discord.js';
import config from '@/config';
import BaseEvent from '@/app/events/BaseEvent';
import {injectable} from 'tsyringe';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import Logger from '@/telemetry/logger';
import FetchPartialReaction from '@/app/middleware/events/FetchPartialReaction';

@injectable()
export default class QualityContentUpvoteEvent
    implements BaseEvent<'messageReactionAdd'>
{
    public name = 'QualityContentUpvoteEvent';
    public event = 'messageReactionAdd' as const;

    public middleware = [FetchPartialReaction];

    constructor(
        private clientService: DiscordClientService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(reaction: MessageReaction): Promise<void> {
        try {
            if (this.isQualityContentChannel(reaction)) return;
            if (!this.meetsUpvoteThreshold(reaction)) return;

            const emoji = this.getEmoji(
                reaction,
                config.qualityContent.emojiName,
            );

            if (reaction.emoji !== emoji) return;

            const channel = await reaction.message.client.channels.fetch(
                config.qualityContent.channelId,
            );

            if (!channel || !channel.isTextBased()) {
                this.logger.error('Could not find channel to send message in');
                return;
            }

            const existingMessage = await this.findExistingMessage(
                channel,
                reaction,
            );

            if (existingMessage) {
                this.logger.info(
                    'Found existing message for quality content, updating...',
                );
                await existingMessage.edit({
                    content: `${reaction.count} <:upvote:${emoji.id}> in <#${reaction.message.channelId}>`,
                });
                return;
            }

            const embed = this.createEmbed(reaction.message);
            await channel.send({
                content: `${reaction.count} <:upvote:${emoji.id}> in <#${reaction.message.channelId}>`,
                embeds: [embed],
            });
        } catch (err) {
            this.logger.fatal('Failed to run QualityContentUpvoteEvent', err);
        }
    }

    /**
     * Check if the reaction is in the quality content channel
     */
    private isQualityContentChannel(reaction: MessageReaction): boolean {
        return reaction.message.channelId === config.qualityContent.channelId;
    }

    /**
     * Check if the reaction meets the upvote threshold
     */
    private meetsUpvoteThreshold(reaction: MessageReaction): boolean {
        return (reaction.count ?? 0) >= config.qualityContent.minEmojiCount;
    }

    /**
     * Get the upvote emoji
     */
    private getEmoji(reaction: MessageReaction, name: string): GuildEmoji {
        const result = reaction.client.emojis.cache.find(
            (emoji) => emoji.name?.toLowerCase().includes(name),
        );

        if (!result) {
            throw new Error('Could not find emoji');
        }

        return result;
    }

    /**
     * Find the existing message in the channel
     */
    private async findExistingMessage(
        channel: Channel,
        reaction: MessageReaction,
    ) {
        if (!channel.isTextBased()) return null;

        const messages = await channel.messages.fetch({limit: 100});
        const message = [...messages.values()].find(
            (message) =>
                message.author.id === this.clientService.getClient().user?.id &&
                message.embeds[0]?.footer?.text.includes(reaction.message.id),
        );

        return message;
    }

    /**
     * Create the embed for the message
     */
    private createEmbed(msg: Message<boolean> | PartialMessage): EmbedBuilder {
        return new EmbedBuilder()
            .setColor(0x202225)
            .setAuthor({
                name: msg.author!.username,
                iconURL: msg.author!.avatarURL()!,
            })
            .setDescription(msg.content!.length > 0 ? msg.content : null)
            .setFields([
                {
                    name: 'Source',
                    value: `[Jump to message](${msg.url})`,
                },
            ])
            .setImage(msg.attachments.first()?.url ?? null)
            .setTimestamp(msg.createdAt)
            .setFooter({text: `Message ID: ${msg.id}`});
    }
}
