import BaseMiddleware from '@/middleware/BaseMiddleware';
import {Constructable} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';

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

export default interface BaseCommand<
    T extends DefaultInteraction = DefaultInteraction,
> {
    /**
     * The name of the command (should be unique!)
     */
    name: string;

    /**
     * The description of the command
     */
    description: string;

    /**
     * The options of the command
     */
    options?: SlashCommandOption[];

    /**
     * Whether the command is enabled or not
     */
    enabled?: boolean;

    /**
     * The middleware to use for this command
     */
    middleware?: Constructable<BaseMiddleware<DefaultInteraction>>[];

    /**
     * Run the command
     */
    execute(interaction: T): Promise<void>;
}
