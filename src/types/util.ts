import BaseCommand from '@/commands/BaseCommand';

export type Maybe<T> = T | null | undefined;

export type Constructable<T> = {
    new (...args: any[]): T;
};

export type Commandable<T extends BaseCommand = BaseCommand> = Constructable<T>;
