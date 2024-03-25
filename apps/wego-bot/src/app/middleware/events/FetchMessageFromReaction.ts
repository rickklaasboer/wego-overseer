import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageReactionAdd' | 'messageReactionRemove'];

@injectable()
export default class FetchMessageFromReaction<
    T extends Event = Event,
> extends BaseMiddleware<T> {
    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [reaction] = ctx;
        await reaction.message.fetch();

        await next(ctx);
    }
}
