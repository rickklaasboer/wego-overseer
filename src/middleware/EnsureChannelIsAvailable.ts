import {DefaultInteraction} from '@/commands/BaseCommand';
import Channel from '@/entities/Channel';
import BaseMiddleware, {NextFn} from '@/middleware/BaseMiddleware';
import ChannelRepository from '@/repositories/ChannelRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class EnsureChannelIsAvailable<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseMiddleware<T> {
    constructor(private channelRepository: ChannelRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const channelId = ctx.options.getChannel('channel')?.id ?? '';
        const channel = await this.channelRepository.getById(channelId);

        if (!(channel instanceof Channel)) {
            await this.channelRepository.create({id: channelId});
        }

        await next(ctx);
    }
}
