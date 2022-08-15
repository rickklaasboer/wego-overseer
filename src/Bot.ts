import {
    Client,
    Collection,
    REST,
    Routes,
    IntentsBitField,
    ChatInputCommandInteraction,
    CacheType,
} from 'discord.js';
import Command from './commands/Command';
import {tap} from './util/tap';

type Props = {
    token: string;
    applicationId: string;
    commands: Array<Command<ChatInputCommandInteraction<CacheType>>>;
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

    constructor({token, applicationId, commands}: Props) {
        this.token = token;
        this.applicationId = applicationId;
        this.client = new Client({
            intents: [
                IntentsBitField.Flags.Guilds,
                IntentsBitField.Flags.GuildMessages,
            ],
        });
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(this.token);
        });

        for (const cmd of commands) {
            this.commands.set(cmd.name, cmd);
        }
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        await this.rest.put(Routes.applicationCommands(this.applicationId), {
            body: this.commands.map(({name, description}) => ({
                name,
                description,
            })),
        });
        await this.client.login(this.token);
    }

    /**
     * Main entry function for bot
     */
    public async boot(): Promise<void> {
        await this.register();
        this.registerCommandHandlers();
    }

    /**
     * Register command handlers (for slash commands)
     */
    private registerCommandHandlers(): void {
        this.client.on('interactionCreate', (interaction) => {
            if (!interaction.isCommand()) return;

            if (this.commands.has(interaction.commandName)) {
                const cmd = this.commands.get(interaction.commandName);
                cmd!.run(interaction as ChatInputCommandInteraction<CacheType>);
            }
        });
    }
}
