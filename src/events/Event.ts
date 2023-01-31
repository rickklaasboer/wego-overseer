import {BotContext} from '@/Bot';
import type {ClientEvents} from 'discord.js';

type Props<T extends keyof ClientEvents> = {
    name: T;
    enabled?: boolean;
    run: (ctx: BotContext, ...args: ClientEvents[T]) => void | Promise<void>;
};

export default class Event<T extends keyof ClientEvents> {
    public name: T;
    public enabled: boolean;
    public run: (
        ctx: BotContext,
        ...args: ClientEvents[T]
    ) => void | Promise<void>;

    constructor({name, enabled = true, run}: Props<T>) {
        this.name = name;
        this.enabled = enabled;
        this.run = run;
    }
}
