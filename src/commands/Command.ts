import {Maybe} from '@/types/util';
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

type SlashCommandOption = {
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

type Props<T> = {
    name: string;
    description: string;
    options?: SlashCommandOption[];
    enabled?: boolean;
    run(interaction: T): void | Promise<void>;
};

export default class Command<T = ChatInputCommandInteraction<CacheType>> {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;
    public run: (interaction: T) => void | Promise<void>;

    constructor({name, description, options, enabled = true, run}: Props<T>) {
        this.name = name;
        this.description = description;
        this.options = options;
        this.enabled = enabled;
        this.run = run;
    }
}
