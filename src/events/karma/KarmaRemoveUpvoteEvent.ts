import {
    ensureChannelIsAvailable,
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Karma from '@/entities/Karma';
import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:events:KarmaRemoveDownvoteEvent');

export const KarmaRemoveUpvoteEvent = new Event({
    name: 'messageReactionRemove',
    run: async (_, reaction, user) => {
        try {
            if (user.bot) return;

            if (reaction.emoji.name !== 'upvote') {
                return;
            }

            const message = reaction.message;

            // Discord provides incomplete message on messageReactionRemove
            await message.fetch();

            await ensureGuildIsAvailable(message.guild?.id);
            await ensureUserIsAvailable(user.id);
            await ensureUserIsAvailable(message.author?.id);
            const channel = await ensureChannelIsAvailable(
                message.channel.id,
                message.guild?.id,
            );

            if (!channel.isKarmaChannel) return;

            const keys = {
                messageId: message.id,
                channelId: message.channel.id,
                guildId: message.guild?.id,
                receivedFromUserId: user.id,
                userId: message.author?.id,
            };

            await Karma.query()
                .where({...keys})
                .delete();
        } catch (err) {
            logger.error('Unable to handle KarmaRemoveUpvoteEvent', err);
        }
    },
});
