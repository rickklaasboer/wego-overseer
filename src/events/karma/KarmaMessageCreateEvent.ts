import {
    ensureChannelIsAvailable,
    ensureGuildIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Logger from '@/telemetry/logger';
import {containsUrl, isEmpty} from '@/util/misc';
import {Collection} from 'discord.js';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaMessageCreateEvent');

export const KarmaMessageCreateEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (_, message) => {
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
            if (
                isEmpty(message.embeds) &&
                isEmpty(message.attachments) &&
                !containsUrl(message.content)
            )
                return;

            const emojis = message.guild?.emojis.cache
                .filter((e) => e.name === 'upvote' || e.name === 'downvote')
                .sort((a, b) => b.name?.localeCompare(a.name ?? '') ?? 0);

            for (const [key] of emojis ?? new Collection()) {
                await message.react(key);
            }
        } catch (err) {
            logger.error('Unable to handle KarmaMessageCreateEvent', err);
        }
    },
});
