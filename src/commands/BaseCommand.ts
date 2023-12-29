import Middleware from '@/middleware/Middleware';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {injectable} from 'inversify';

export enum APPLICATION_COMMAND_OPTIONS {
    SUB_COMMAND = 1,
    SUB_COMMAND_GROUP = 2,
    STRING = 3,
    INTEGER = 4,
    BOOLEAN = 5,
    USER = 6,
    CHANNEL = 7,
    ROLE = 8,
    MENTIONABLE = 9,
    NUMBER = 10,
    ATTACHMENT = 11,
}

type ApplicationCommandOption = {
    name: string;
    value: string | number;
};

export type SlashCommandOption = {
    type: APPLICATION_COMMAND_OPTIONS;
    name: string;
    description: string;
    required?: boolean;
    choices?: ApplicationCommandOption[];
    options?: SlashCommandOption[];
    channel_types?: [];
    min_value?: number;
    max_value?: number;
    min_length?: number;
    max_length?: number;
    autocomplete?: boolean;
};

export type DefaultInteraction = ChatInputCommandInteraction<CacheType>;

@injectable()
export default abstract class BaseCommand<
    T extends DefaultInteraction = DefaultInteraction,
> {
    /**
     * The name of the command (should be unique!)
     */
    public abstract name: string;

    /**
     * The description of the command
     */
    public abstract description: string;

    /**
     * The options of the command
     */
    public abstract options: Maybe<SlashCommandOption[]>;

    /**
     * Whether the command is enabled or not
     */
    public abstract enabled: boolean;

    /**
     * The middleware to use for this command
     */
    public middleware: (typeof Middleware<T>)[] = [];

    /**
     * Run the command
     */
    public abstract execute(interaction: T): Promise<void>;
}
