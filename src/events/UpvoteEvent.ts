import Logger from '@/telemetry/logger';
import {APIEmbed} from 'discord.js';
import {client} from '..';
import Event from './Event';

const logger = new Logger('wego-overseer:UpvoteEvent');

// Get .env variables or fall back to defaults
const QCC_EMOJI_NAME = process.env.QCC_EMOJI_NAME?.toLowerCase() ?? 'upvote';
const QCC_MIN_EMOJI_COUNT = process.env.QCC_MIN_EMOJI_COUNT ?? 5;
const QCC_CHANNEL_ID = process.env.QCC_CHANNEL_ID ?? '';

export const UpvoteEvent = new Event<'messageReactionAdd'>({
    name: 'messageReactionAdd',
    enabled: true,
    run: async (reaction) => {
        try {
            // Check if reaction count is above or equal to the minimal emoji count threshold
            if ((reaction.count ?? 0) < QCC_MIN_EMOJI_COUNT) return;

            // Get the emoji
            const emoji = reaction.client.emojis.cache.find((emoji) =>
                emoji.name?.toLowerCase().includes(QCC_EMOJI_NAME),
            );
            // Make sure an emoji was found
            if (!emoji) {
                logger.fatal("Couldn't find emoji with name", QCC_EMOJI_NAME);
                return;
            }

            // Check if reaction is an upvote (or the .env specified emoji)
            if (reaction.emoji !== emoji) return;

            // Get the channel
            const channel = await reaction.message.client.channels.fetch(
                QCC_CHANNEL_ID,
            );

            // Check if channel has been found
            if (!channel) {
                logger.fatal('Could not find channel to send message in');
                return;
            }

            // Check if channel is a text channel
            if (!channel.isTextBased()) {
                logger.fatal('Channel is not a text channel');
                return;
            }

            // Check if message is already in the channel
            const messages = await channel.messages.fetch({limit: 100}); // Fetch last 100 messages (should be enough) to check if message is already in the channel
            const message = [...messages.values()].find(
                // Search by bot id and reaction message id
                (message) =>
                    message.author.id === client.user?.id &&
                    message.embeds[0].footer?.text.includes(
                        reaction.message.id,
                    ),
            );

            // Check if a message already exists
            if (message) {
                // Edit the existing message
                await message.edit({
                    content: `${reaction.count} <:upvote:${emoji?.id}> in <#${reaction.message.channelId}>`,
                });
            } else {
                // Create embed
                const embed: APIEmbed = {
                    color: 0x202225,
                    author: {
                        name: reaction.message.author!.username,
                        icon_url: reaction.message.author!.avatarURL()!,
                    },
                    description: reaction.message.content ?? undefined,
                    fields: [
                        {
                            name: 'Source',
                            value: `[Jump to message](${reaction.message.url})`,
                        },
                    ],
                    image: {
                        url: reaction.message.attachments.first()?.url ?? '',
                    },
                    timestamp: reaction.message.createdAt.toISOString(),
                    footer: {
                        text: `Message ID: ${reaction.message.id}`,
                    },
                };

                // Send a message in the specified channel
                await channel.send({
                    content: `${reaction.count} <:upvote:${emoji?.id}> in <#${reaction.message.channelId}>`,
                    embeds: [embed],
                });
            }
        } catch (err) {
            logger.fatal('Unable to handle UpvoteEvent', err);
        }
    },
});
