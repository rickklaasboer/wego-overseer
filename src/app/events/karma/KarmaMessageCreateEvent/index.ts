import Logger from '@/telemetry/logger';
import {containsUrl, isEmpty} from '@/util/misc/misc';
import {Collection, Message} from 'discord.js';
import BaseEvent from '@/app/events/BaseEvent';

import ChannelRepository from '@/app/repositories/ChannelRepository';
import {injectable} from 'tsyringe';
import EnsureGuildIsAvailable from '@/app/events/karma/KarmaMessageCreateEvent/middleware/EnsureGuildIsAvailable';
import EnsureChannelIsAvailable from '@/app/events/karma/KarmaMessageCreateEvent/middleware/EnsureChannelIsAvailable';
import Channel from '@/app/entities/Channel';
import config from '@/config';

@injectable()
export default class KarmaMessageCreateEvent
    implements BaseEvent<'messageCreate'>
{
    public name = 'KarmaMessageCreateEvent';
    public event = 'messageCreate' as const;

    public middleware = [EnsureGuildIsAvailable, EnsureChannelIsAvailable];

    constructor(
        private channelRepository: ChannelRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            if (message.author.bot) return;

            const channel = await this.channelRepository.getById(
                message.channel.id,
            );

            if (!channel) {
                throw new Error('Channel is not available');
            }

            if (this.shouldCancel(message, channel)) return;

            const emojis = message.guild?.emojis.cache
                .filter(
                    (e) =>
                        e.name === config.karma.upvote ||
                        e.name === config.karma.downvote,
                )
                .sort((a, b) => b.name?.localeCompare(a.name ?? '') ?? 0);

            if ((emojis?.size ?? 0) < 2) {
                throw new Error('Upvote or downvote emoji not available');
            }

            for (const [key] of emojis ?? new Collection()) {
                await message.react(key);
            }
        } catch (err) {
            this.logger.fatal('Failed to run KarmaMessageCreateEvent', err);
        }
    }

    /**
     * Whether or not the message should receive upvote/downvote reactions
     *
     * @see https://github.com/rickklaasboer/wego-overseer/issues/70
     */
    private shouldCancel(message: Message<boolean>, channel: Channel): boolean {
        return (
            !channel.isKarmaChannel ||
            (isEmpty(message.embeds) &&
                isEmpty(message.attachments) &&
                !containsUrl(message.content))
        );
    }
}
