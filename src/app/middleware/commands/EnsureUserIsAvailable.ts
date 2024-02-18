import {DefaultInteraction} from '@/app/commands/BaseCommand';
import User from '@/app/entities/User';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import UserRepository from '@/app/repositories/UserRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class EnsureUserIsAvailable<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseMiddleware<T> {
    constructor(private userRepository: UserRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const userId = (ctx.options.getUser('user') ?? ctx.user).id;
        const user = await this.userRepository.getById(userId);

        if (!(user instanceof User)) {
            await this.userRepository.create({
                id: userId,
                username: ctx.user.username,
                avatar: ctx.user.avatar ?? '',
            });
        }

        await next(ctx);
    }
}
