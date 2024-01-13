import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseMiddleware, {NextFn} from '@/middleware/BaseMiddleware';
import {isAdmin} from '@/util/discord';
import {AuthorizationError} from '@/util/errors/AuthorizationError';
import {injectable} from 'tsyringe';

@injectable()
export default class UserIsAdmin<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseMiddleware<T> {
    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        if (!isAdmin(ctx)) {
            throw new AuthorizationError();
        }

        await next(ctx);
    }
}
