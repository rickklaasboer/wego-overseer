import {BotContext} from '@/Bot';
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

export type Props<T extends ChatInputCommandInteraction<CacheType>> = {
    name: string;
    description: string;
    options?: SlashCommandOption[];
    enabled?: boolean;
    shouldDeferReply?: boolean;
    run(interaction: T, self: Command<T>, ctx: BotContext): Promise<void>;
};

export default class Command<T extends ChatInputCommandInteraction<CacheType>> {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;
    public shouldDeferReply: boolean;
    private _run: (
        interaction: T,
        self: Command<T>,
        ctx: BotContext,
    ) => Promise<void>;

    constructor({
        name,
        description,
        options,
        enabled = true,
        shouldDeferReply = false,
        run,
    }: Props<T>) {
        this.name = name;
        this.description = description;
        this.options = options;
        this.enabled = enabled;
        this.shouldDeferReply = shouldDeferReply;
        this._run = run;
    }

    /**
     * Returns the run method wrapped in a function that defers the reply
     */
    public get run(): (
        interaction: T,
        self: Command<T>,
        ctx: BotContext,
    ) => Promise<void> {
        return this.wrappedRun;
    }

    /**
     * Wraps the run method in a function that defers the reply
     */
    private async wrappedRun(
        interaction: T,
        self: Command<T>,
        ctx: BotContext,
    ): Promise<void> {
        if (this.shouldDeferReply) {
            await interaction.deferReply();
        }

        return this._run(interaction, self, ctx);
    }

    public async forwardTo(
        to: Command<T>,
        interaction: T,
        ctx: BotContext,
    ): Promise<void> {
        await to.run(interaction, this, ctx);
    }
}
