import {DefaultInteraction} from '@/commands/BaseCommand';
import User from '@/entities/User';
import BaseMiddleware, {NextFn} from '@/middleware/BaseMiddleware';
import UserRepository from '@/repositories/UserRepository';
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
            await this.userRepository.create({id: userId});
        }

        await next(ctx);
    }
}
