import {injectable} from 'inversify';

export type NextFn = () => Promise<void>;

@injectable()
export default abstract class Middleware<T> {
    public abstract handle(ctx: T, next: NextFn): Promise<void>;
}
