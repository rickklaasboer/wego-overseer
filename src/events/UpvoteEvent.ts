/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Logger from '@/telemetry/logger';
import {getEnvInt, getEnvString} from '@/util/environment';
import {EmbedBuilder} from 'discord.js';
import Event from './Event';

const logger = new Logger('wego-overseer:events:UpvoteEvent');

// Get .env variables or fall back to defaults
const QCC_EMOJI_NAME = getEnvString('QCC_EMOJI_NAME', 'upvote').toLowerCase();
const QCC_MIN_EMOJI_COUNT = getEnvInt('QCC_MIN_EMOJI_COUNT', 5);
const QCC_CHANNEL_ID = getEnvString('QCC_CHANNEL_ID', '');

export const UpvoteEvent = new Event({
    name: 'messageReactionAdd',
    enabled: true,
    run: async ({client}, reaction) => {
        try {
            // Ignore messages in the quality content corner channel
            if (reaction.message.channelId === QCC_CHANNEL_ID) return;

            // Check if reaction count is above or equal to the minimal emoji count threshold
            if ((reaction.count ?? 0) < QCC_MIN_EMOJI_COUNT) return;

            // Get the emoji
            const emoji = reaction.client.emojis.cache.find(
                (emoji) => emoji.name?.toLowerCase().includes(QCC_EMOJI_NAME),
            );

            // Make sure an emoji was found
            if (!emoji) {
                logger.error("Couldn't find emoji with name", QCC_EMOJI_NAME);
                return;
            }

            // Check if reaction is an upvote (or the .env specified emoji)
            if (reaction.emoji !== emoji) return;

            // Get the channel
            const channel = await reaction.message.client.channels.fetch(
                QCC_CHANNEL_ID,
            );

            // Check if channel has been found
            if (!channel || !channel.isTextBased()) {
                logger.error('Could not find channel to send message in');
                return;
            }

            // Check if message is already in the channel
            // Fetch last 100 messages (should be enough) to check if message is already in the channel
            const messages = await channel.messages.fetch({limit: 100});
            const message = [...messages.values()].find(
                // Search by bot id and reaction message id
                (message) =>
                    message.author.id === client.user?.id &&
                    message.embeds[0].footer?.text.includes(
                        reaction.message.id,
                    ),
            );

            const msg = reaction.message;
            if (message) {
                await message.edit({
                    content: `${reaction.count} <:upvote:${emoji?.id}> in <#${msg.channelId}>`,
                });
                return;
            }

            const embed = new EmbedBuilder()
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

            // Send a message in the specified channel
            await channel.send({
                content: `${reaction.count} <:upvote:${emoji?.id}> in <#${msg.channelId}>`,
                embeds: [embed],
            });
        } catch (err) {
            logger.fatal('Unable to handle UpvoteEvent', err);
        }
    },
});
