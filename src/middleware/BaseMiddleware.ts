export type NextFn<T> = (ctx: T) => Promise<void>;

export default abstract class BaseMiddleware<T> {
    public abstract handle(ctx: T, next: NextFn<T>): Promise<void>;
}
