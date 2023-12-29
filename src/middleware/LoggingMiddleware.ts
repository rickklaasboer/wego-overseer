import Middleware, {NextFn} from '@/middleware/Middleware';
import {injectable} from 'inversify';

@injectable()
export default class LoggingMiddleware<T> extends Middleware<T> {
    public async handle(ctx: T, next: NextFn): Promise<void> {
        console.log('Hello world!', {ctx});
        await next();
    }
}
