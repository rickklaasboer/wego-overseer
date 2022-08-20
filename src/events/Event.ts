import type {ClientEvents} from 'discord.js';

type Props<T extends keyof ClientEvents> = {
    name: T;
    run: (...args: ClientEvents[T]) => void | Promise<void>;
};

export default class Event<T extends keyof ClientEvents> {
    public name: T;
    public run: (...args: ClientEvents[T]) => void | Promise<void>;

    constructor({name, run}: Props<T>) {
        this.name = name;
        this.run = run;
    }
}
