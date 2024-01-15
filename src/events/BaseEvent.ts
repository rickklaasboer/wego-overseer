import BaseMiddleware from '@/middleware/BaseMiddleware';
import {Constructable} from '@/types/util';
import {ClientEvents} from 'discord.js';

export type EventKeys = keyof ClientEvents;
export type ClientEventsKeys = ClientEvents[keyof ClientEvents];

export default interface BaseEvent<T extends keyof ClientEvents> {
    /**
     * The name/identifier of the event (should be unique!)
     */
    name: string;

    /**
     * The event itself (from discord.js)
     */
    event: T;

    /**
     * Whether the event is enabled or not
     */
    enabled?: boolean;

    /**
     * The middleware to use for this event
     */
    middleware?: Constructable<BaseMiddleware<ClientEvents[T]>>[];

    /**
     * Run the event
     */
    execute(...args: ClientEvents[T]): Promise<void>;
}
