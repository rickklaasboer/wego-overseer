import BaseEvent from '@/app/events/BaseEvent';
import {
    MessageReaction,
    PartialMessageReaction,
    User,
    PartialUser,
} from 'discord.js';
import FetchMessageFromReaction from '@/app/middleware/events/FetchMessageFromReaction';
import EnsureGuildIsAvailable from '@/app/middleware/events/EnsureGuildIsAvailable';
import EnsureUserIsAvailable from '@/app/middleware/events/EnsureUserIsAvailable';
import EnsureAuthorIsAvailable from '@/app/middleware/events/EnsureAuthorIsAvailable';
import EnsureChannelIsAvailable from '@/app/middleware/events/EnsureChannelIsAvailable';
import ChannelRepository from '@/app/repositories/ChannelRepository';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class KarmaRemoveDownvoteEvent
    implements BaseEvent<'messageReactionRemove'>
{
    public name = 'KarmaRemoveDownvoteEvent';
    public event = 'messageReactionRemove' as const;

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
            if (reaction.emoji.name !== 'downvote') return;

            const channel = await this.channelRepository.getById(
                reaction.message.channel.id,
            );

            if (!channel) {
                throw new Error('Channel is not available');
            }

            const values = {
                messageId: reaction.message.id,
                channelId: reaction.message.channel.id,
                guildId: reaction.message.guild?.id,
                receivedFromUserId: user.id,
                userId: reaction.message.author?.id,
            };

            const karma = await this.karmaRepository.getByWhere(values);
            if (karma) {
                await this.karmaRepository.delete(karma.id);
            }
        } catch (err) {
            this.logger.fatal('Failed to run KarmaRemoveDownvoteEvent', err);
        }
    }
}
