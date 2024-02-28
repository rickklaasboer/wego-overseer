import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import UserRepository from '@/app/repositories/UserRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageCreate'];

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
        const [message] = ctx;
        const userId = message.author.id;
        const user = await this.userRepository.getById(userId);

        if (!user) {
            await this.userRepository.create({
                id: userId,
                username: message.author.username,
                avatar: message.author.avatar ?? '',
            });
        }

        await next(ctx);
    }
}
