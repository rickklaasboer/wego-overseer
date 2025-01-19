import {Maybe} from '@/types/util';
import {Client, IntentsBitField, Partials} from 'discord.js';
import {singleton} from 'tsyringe';

@singleton()
export default class DiscordClientService {
    private client: Client;

    constructor() {
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
    }

    /**
     * Login using token
     */
    public async login(token: string): Promise<string> {
        return this.client.login(token);
    }

    /**
     * Get the bot's tag
     */
    public getTag(): Maybe<string> {
        return this.client.user?.tag;
    }

    /**
     * Get the Discord client instance
     */
    public getClient(): Client {
        return this.client;
    }
}
