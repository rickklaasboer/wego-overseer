/* eslint-disable @typescript-eslint/no-explicit-any */
import BaseCommand from '@/app/commands/BaseCommand';
import BaseEvent from '@/app/events/BaseEvent';
import BaseJob from '@/app/jobs/BaseJob';
import {ClientEvents} from 'discord.js';

export type Maybe<T> = T | null | undefined;

export type Constructable<T> = {
    new (...args: any[]): T;
};

export type Commandable<T extends BaseCommand = BaseCommand> = Constructable<T>;

export type Eventable<
    T extends BaseEvent<keyof ClientEvents> = BaseEvent<keyof ClientEvents>,
> = Constructable<T>;

export type Jobable<T extends BaseJob = BaseJob> = Constructable<T>;
