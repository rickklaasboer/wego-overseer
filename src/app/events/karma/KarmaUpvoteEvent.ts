import {randomNumber} from '@/util/misc/karma';
import BaseEvent from '@/app/events/BaseEvent';
import {
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
    Message,
    PartialMessage,
} from 'discord.js';
import Logger from '@/telemetry/logger';
import EnsureGuildIsAvailable from '@/app/middleware/events/EnsureGuildIsAvailable';
import EnsureUserIsAvailable from '@/app/middleware/events/EnsureUserIsAvailable';
import EnsureAuthorIsAvailable from '@/app/middleware/events/EnsureAuthorIsAvailable';
import EnsureChannelIsAvailable from '@/app/middleware/events/EnsureChannelIsAvailable';
import ChannelRepository from '@/app/repositories/ChannelRepository';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import FetchMessageFromReaction from '@/app/middleware/events/FetchMessageFromReaction';
import {injectable} from 'tsyringe';
import config from '@/config';

@injectable()
export default class KarmaUpvoteEvent
    implements BaseEvent<'messageReactionAdd'>
{
    public name = 'KarmaUpvoteEvent';
    public event = 'messageReactionAdd' as const;

    public middleware = [
        FetchMessageFromReaction,
        EnsureGuildIsAvailable,
        EnsureUserIsAvailable,
        EnsureAuthorIsAvailable,
        EnsureChannelIsAvailable,
    ];

    constructor(
        private channelRepository: ChannelRepository,
        private karmaRepository: KarmaRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(
        reaction: MessageReaction | PartialMessageReaction,
        user: User | PartialUser,
    ): Promise<void> {
        try {
            if (user.bot) return;
            if (reaction.emoji.name !== config.karma.upvote) return;

            const channel = await this.channelRepository.getById(
                reaction.message.channel.id,
            );

            if (!channel) {
                throw new Error('Channel is not available');
            }

            await this.removeExistingVotes(reaction.message, user);

            const values = {
                messageId: reaction.message.id,
                channelId: reaction.message.channel.id,
                guildId: reaction.message.guild?.id,
                receivedFromUserId: user.id,
                userId: reaction.message.author?.id,
            };

            const karma = await this.karmaRepository.getByWhere(values);
            const amount = randomNumber(1, 5);

            if (karma) {
                await this.karmaRepository.update(karma.id, {
                    ...values,
                    amount,
                });
            } else {
                await this.karmaRepository.create({...values, amount});
            }
        } catch (err) {
            this.logger.fatal('Failed to run KarmaUpvoteEvent', err);
        }
    }

    /**
     * Remove existing votes
     */
    private async removeExistingVotes(
        message: Message<boolean> | PartialMessage,
        user: User | PartialUser,
    ): Promise<void> {
        const downvote = message.guild?.emojis.cache.find((e) => {
            return e.name === config.karma.downvote;
        });

        // Remove downvotes from user if any
        await message.reactions
            .resolve(downvote?.id ?? '')
            ?.users.remove(user.id);
    }
}
