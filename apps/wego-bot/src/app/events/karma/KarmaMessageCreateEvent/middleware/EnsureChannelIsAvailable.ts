import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import ChannelRepository from '@/app/repositories/ChannelRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageCreate'];

@injectable()
export default class EnsureChannelIsAvailable<
    T extends Event = Event,
> extends BaseMiddleware<T> {
    constructor(private channelRepository: ChannelRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [message] = ctx;

        const guildId = message.guild?.id;
        const channelId = message.channel?.id;
        if (!guildId || !channelId) {
            throw new Error('Guild or channel is not available');
        }

        const exists = await this.channelRepository.exists(channelId);

        if (!exists) {
            await this.channelRepository.create({id: channelId, guildId});
        }

        await next(ctx);
    }
}
