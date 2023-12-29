import {DefaultInteraction} from '@/commands/BaseCommand';
import Middleware, {NextFn} from '@/middleware/Middleware';

export default class EnsureGuildIsAvailable<
    T extends DefaultInteraction = DefaultInteraction,
> extends Middleware<T> {
    public async handle(ctx: T, next: NextFn): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
