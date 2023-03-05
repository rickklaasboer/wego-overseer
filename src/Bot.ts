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
import {Player} from 'discord-player';
import Command from '@/commands/Command';
import Event from '@/events/Event';
import {tap} from '@/util/tap';
import {Knex} from 'knex';
import {CronJob} from 'cron';
import Logger from './telemetry/logger';
import dayjs from 'dayjs';

type Props = {
    token: string;
    applicationId: string;
    commands: Array<Command<ChatInputCommandInteraction<CacheType>>>;
    events: Array<Event<any>>;
    jobs: Array<[CronJob, (ctx: BotContext) => Promise<void>]>;
    ctx: Omit<BotContext, 'client' | 'bot' | 'player'>;
};

export type BotContext = {
    client: Client;
    db: Knex;
    bot: Bot;
    player: Player;
};

const logger = new Logger('wego-overseer:Bot');

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
    private jobs: Array<[CronJob, (ctx: BotContext) => Promise<void>]>;
    private _ctx: BotContext;

    constructor({
        token,
        applicationId,
        commands,
        events,
        jobs = [],
        ctx,
    }: Props) {
        this.token = token;
        this.applicationId = applicationId;
        this.client = new Client({
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
        });
        this.jobs = jobs;
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(this.token);
        });

        for (const cmd of commands) {
            this._commands.set(cmd.name, cmd);
        }

        this.events = events;

        this._ctx = {
            ...ctx,
            player: new Player(this.client),
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
        const now = dayjs();
        logger.info(`Started registering`);

        await this.rest.put(Routes.applicationCommands(this.applicationId), {
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
            this.client.on('ready', () => resolve());
        });

        await this.client.login(this.token);
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
        for (const event of this.events) {
            if (event.enabled) {
                this.client.on(event.name, (...args) => {
                    event.run(this._ctx, ...args);
                });
            }
        }

        logger.info(
            `Successfully registered ${
                this.events.length
            } event(s) ([${this.events.map(({name}) => name).join(', ')}])`,
        );
    }

    /**
     * Register jobs
     */
    private registerJobs(): void {
        for (const [job, onTick] of this.jobs) {
            job.addCallback(async () => await onTick(this._ctx));
            job.start();
        }

        logger.info(`Successfully registered ${this.jobs.length} job(s)`);
    }
}
