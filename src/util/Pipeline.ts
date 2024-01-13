import BaseMiddleware, {NextFn} from '@/middleware/BaseMiddleware';
import {Constructable} from '@/types/util';
import {container, injectable} from 'tsyringe';

@injectable()
export class Pipeline<T> {
    private passable!: T;
    private pipes: Constructable<BaseMiddleware<T>>[] = [];

    /**
     * Set the object being sent through the pipeline
     */
    public send(passable: T): this {
        this.passable = passable;
        return this;
    }

    /**
     * Set the stages of the pipeline
     */
    public through(pipes: Constructable<BaseMiddleware<T>>[]): this {
        this.pipes = pipes;
        return this;
    }

    /**
     * Run the pipeline
     */
    public async go(): Promise<T> {
        // If there are no pipes, just return the passable
        if (this.pipes.length < 1) return this.passable;

        let index = 0;

        const next: NextFn<T> = async (ctx: T): Promise<void> => {
            if (index < this.pipes.length) {
                const resolvable = this.pipes[index++];
                const pipe = container.resolve(resolvable);
                await pipe.handle(ctx, () => next(ctx));
            }
        };

        await next(this.passable);

        return this.passable;
    }
}
