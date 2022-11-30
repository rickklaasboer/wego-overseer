import {
    Client,
    Collection,
    REST,
    Routes,
    IntentsBitField,
    ChatInputCommandInteraction,
    CacheType,
} from 'discord.js';
import Command from '@/commands/Command';
import Event from '@/events/Event';
import {tap} from '@/util/tap';

type Props = {
    token: string;
    applicationId: string;
    commands: Array<Command<ChatInputCommandInteraction<CacheType>>>;
    events: Array<Event<any>>;
};

export default class Bot {
    private token: string;
    private applicationId: string;
    private rest: REST;
    private client: Client;
    private commands = new Collection<
        string,
        Command<ChatInputCommandInteraction<CacheType>>
    >();
    private events: Array<Event<any>>;

    constructor({token, applicationId, commands, events}: Props) {
        this.token = token;
        this.applicationId = applicationId;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
                IntentsBitField.Flags.MessageContent,
                IntentsBitField.Flags.GuildMessageReactions,
            ],
        });
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(this.token);
        });

        for (const cmd of commands) {
            this.commands.set(cmd.name, cmd);
        }

        this.events = events;
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        await this.rest.put(Routes.applicationCommands(this.applicationId), {
            body: this.commands.map(({name, description, options}) => ({
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

            if (this.commands.has(interaction.commandName)) {
                const cmd = this.commands.get(interaction.commandName);
                cmd?.run(interaction as ChatInputCommandInteraction<CacheType>);
            }
        });
    }

    /**
     * Register event handlers
     */
    private registerEventHandlers(): void {
        this.events.forEach((evt) =>
            evt.enabled ? this.client.on(evt.name, evt.run) : null,
        );
    }

    /**
     * Get registered commands
     */
    public getCommands(): Collection<
        string,
        Command<ChatInputCommandInteraction<CacheType>>
    > {
        return this.commands;
    }
}
