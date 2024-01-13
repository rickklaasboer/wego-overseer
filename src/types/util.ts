import BaseCommand from '@/commands/BaseCommand';

export type Maybe<T> = T | null | undefined;

export type Constructable<T> = {
    new (...args: any[]): T;
};

export type Commandable<T extends BaseCommand = BaseCommand> = Constructable<T>;

// TODO: Add eventable type
export type Eventable<T = unknown> = Constructable<T>;

// TODO: Add jobable type
export type Jobable<T = unknown> = Constructable<T>;
