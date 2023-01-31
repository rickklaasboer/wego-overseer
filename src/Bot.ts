/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    Client,
    Collection,
    REST,
    Routes,
    IntentsBitField,
    ChatInputCommandInteraction,
    CacheType,
    Partials,
} from 'discord.js';
import Command from '@/commands/Command';
import Event from '@/events/Event';
import {tap} from '@/util/tap';
import {Knex} from 'knex';

type Props = {
    token: string;
    applicationId: string;
    commands: Array<Command<ChatInputCommandInteraction<CacheType>>>;
    events: Array<Event<any>>;
    ctx: Omit<BotContext, 'client' | 'bot'>;
};

export type BotContext = {
    client: Client;
    db: Knex;
    bot: Bot;
};

export default class Bot {
    private token: string;
    private applicationId: string;
    private rest: REST;
    private client: Client;
    private _commands = new Collection<
        string,
        Command<ChatInputCommandInteraction<CacheType>>
    >();
    private events: Array<Event<any>>;
    private _ctx: BotContext;

    constructor({token, applicationId, commands, events, ctx}: Props) {
        this.token = token;
        this.applicationId = applicationId;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.GuildMessageReactions,
                IntentsBitField.Flags.MessageContent,
            ],
            partials: [
                Partials.Channel,
                Partials.Message,
                Partials.Reaction,
                Partials.User,
                Partials.GuildMember,
            ],
        });
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(this.token);
        });

        for (const cmd of commands) {
            this._commands.set(cmd.name, cmd);
        }

        this.events = events;

        this._ctx = {
            ...ctx,
            client: this.client,
            bot: this,
        };
    }

    public get ctx(): BotContext {
        return this._ctx;
    }

    public get commands(): Collection<
        string,
        Command<ChatInputCommandInteraction<CacheType>>
    > {
        return this._commands;
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        await this.rest.put(Routes.applicationCommands(this.applicationId), {
            body: this._commands.map(({name, description, options}) => ({
                name,
                description,
                options,
            })),
        });
        await this.client.login(this.token);
        await new Promise<void>((resolve) => {
            this.client.on('ready', () => resolve());
        });
    }

    /**
     * Main entry function for bot
     */
    public async boot(): Promise<Client> {
        await this.register();
        this.registerCommandHandlers();
        this.registerEventHandlers();

        return this.client;
    }

    /**
     * Register command handlers (for slash commands)
     */
    private registerCommandHandlers(): void {
        this.client.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) return;

            if (this._commands.has(interaction.commandName)) {
                const cmd = this._commands.get(interaction.commandName);
                cmd?.run(
                    interaction as ChatInputCommandInteraction<CacheType>,
                    cmd,
                    this._ctx,
                );
            }
        });
    }

    /**
     * Register event handlers
     */
    private registerEventHandlers(): void {
        for (const event of this.events) {
            if (event.enabled) {
                this.client.on(event.name, (...args) => {
                    event.run(this._ctx, ...args);
                });
            }
        }
    }
}
