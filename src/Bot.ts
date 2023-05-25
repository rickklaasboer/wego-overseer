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
    ClientOptions,
} from 'discord.js';
import {Player} from 'discord-player';
import Command from '@/commands/Command';
import Event from '@/events/Event';
import {tap} from '@/util/tap';
import {Knex} from 'knex';
import Logger from './telemetry/logger';
import dayjs from 'dayjs';
import Job from './jobs/Job';

type Props = {
    token: string;
    applicationId: string;
    commands: Array<Command<ChatInputCommandInteraction<CacheType>>>;
    events: Array<Event<any>>;
    jobs: Array<Job>;
    ctx: Omit<BotContext, 'client' | 'bot' | 'player'>;
};

export type BotContext = {
    client: Client;
    db: Knex;
    bot: Bot;
    player: Player;
};

const logger = new Logger('wego-overseer:Bot');

const CLIEN_OPTIONS: ClientOptions = {
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.Reaction,
        Partials.User,
        Partials.GuildMember,
    ],
};

export default class Bot {
    private _token: string;
    private _applicationId: string;
    private _rest: REST;
    private _client: Client;
    private _commands = new Collection<
        string,
        Command<ChatInputCommandInteraction<CacheType>>
    >();
    private _events: Array<Event<any>>;
    private _jobs: Array<Job>;
    private _ctx: BotContext;

    constructor({
        token,
        applicationId,
        commands,
        events,
        jobs = [],
        ctx,
    }: Props) {
        this._token = token;
        this._applicationId = applicationId;
        this._client = new Client(CLIEN_OPTIONS);
        this._jobs = jobs;
        this._rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(this._token);
        });

        for (const cmd of commands) {
            this._commands.set(cmd.name, cmd);
        }

        this._events = events;

        this._ctx = {
            ...ctx,
            player: tap(new Player(this._client), (p) => {
                p.extractors.loadDefault();
            }),
            client: this._client,
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
        const now = dayjs();
        logger.info(`Started registering`);

        await this._rest.put(Routes.applicationCommands(this._applicationId), {
            body: this._commands.map(({name, description, options}) => ({
                name,
                description,
                options,
            })),
        });

        logger.info(
            `Rest client sent commands to discord in ${dayjs().diff(now)}ms`,
        );

        const isReady = new Promise<void>((resolve) => {
            this._client.on('ready', () => resolve());
        });

        await this._client.login(this._token);
        await isReady;

        logger.info(
            `Discord client successfully logged-in in ${dayjs().diff(now)}ms`,
        );
    }

    /**
     * Main entry function for bot
     */
    public async boot(): Promise<Client> {
        const now = dayjs();
        logger.info(`Started booting`);

        await this.register();
        this.registerCommandHandlers();
        this.registerEventHandlers();
        this.registerJobs();

        logger.info(`Successfully booted in ${dayjs().diff(now)}ms`);

        return this._client;
    }

    /**
     * Register command handlers (for slash commands)
     */
    private registerCommandHandlers(): void {
        this._client.on('interactionCreate', (interaction) => {
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

        logger.info(
            `Successfully registered ${
                this.commands.size
            } commands(s) ([${Array.from(this.commands.keys()).join(', ')}])`,
        );
    }

    /**
     * Register event handlers
     */
    private registerEventHandlers(): void {
        for (const event of this._events) {
            if (event.enabled) {
                this._client.on(event.name, (...args) => {
                    event.run(this._ctx, ...args);
                });
            }
        }

        logger.info(
            `Successfully registered ${
                this._events.length
            } event(s) ([${this._events.map(({name}) => name).join(', ')}])`,
        );
    }

    /**
     * Register jobs
     */
    private registerJobs(): void {
        for (const {job, onTick} of this._jobs) {
            job.addCallback(async () => await onTick(this._ctx));
            job.start();
        }

        logger.info(
            `Successfully registered ${this._jobs.length} job(s) ([${this._jobs
                .map(({name}) => name)
                .join(', ')}])`,
        );
    }
}
