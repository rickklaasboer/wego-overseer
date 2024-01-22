import User from '@/app/entities/User';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import UserRepository from '@/app/repositories/UserRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageReactionAdd' | 'messageReactionRemove'];

@injectable()
export default class EnsureUserIsAvailable<
    T extends Event = Event,
> extends BaseMiddleware<T> {
    constructor(private userRepository: UserRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [, discordUser] = ctx;
        const user = await this.userRepository.getById(discordUser.id);

        if (!(user instanceof User)) {
            await this.userRepository.create({id: discordUser.id});
        }

        await next(ctx);
    }
}
