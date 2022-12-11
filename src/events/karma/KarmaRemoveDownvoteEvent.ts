import {
    ensureChannelIsAvailable,
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import Karma from '@/entities/Karma';
import Event from '../Event';

export const KarmaRemoveDownvoteEvent = new Event<'messageReactionRemove'>({
    name: 'messageReactionRemove',
    run: async (reaction, user) => {
        if (user.bot) return;

        if (reaction.emoji.name !== 'downvote') {
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
    },
});
