import {
    ensureChannelIsAvailable,
    ensureGuildIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Logger from '@/telemetry/logger';
import {Collection} from 'discord.js';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaMessageCreateEvent');

export const KarmaMessageCreateEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        try {
            if (message.author.bot) return;

            await ensureGuildIsAvailable(message.guild?.id);
            const channel = await ensureChannelIsAvailable(
                message.channel.id,
                message.guild?.id,
            );

            if (!channel.isKarmaChannel) return;

            // Cancel when message does not have any embeds or attachments
            // @see https://github.com/rickklaasboer/wego-overseer/issues/70
            if (!message.embeds.length && !message.attachments.hasAny()) return;

            const emojis = message.guild?.emojis.cache.filter((e) => {
                return e.name === 'upvote' || e.name === 'downvote';
            });

            for (const [key] of emojis ?? new Collection()) {
                await message.react(key);
            }
        } catch (err) {
            logger.error('Unable to handle KarmaMessageCreateEvent', err);
        }
    },
});
