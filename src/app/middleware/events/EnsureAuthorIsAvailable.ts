import User from '@/app/entities/User';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import UserRepository from '@/app/repositories/UserRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageReactionAdd' | 'messageReactionRemove'];

@injectable()
export default class EnsureAuthorIsAvailable<
    T extends Event = Event,
> extends BaseMiddleware<T> {
    constructor(private userRepository: UserRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [reaction] = ctx;

        // Discord provides incomplete message on messageReactionAdd
        await reaction.message.fetch();
        if (!reaction.message.author?.id) {
            throw new Error('Message author is not available');
        }
        const userId = reaction.message.author.id;

        const user = await this.userRepository.getById(userId);

        if (!(user instanceof User)) {
            await this.userRepository.create({id: userId});
        }

        await next(ctx);
    }
}
