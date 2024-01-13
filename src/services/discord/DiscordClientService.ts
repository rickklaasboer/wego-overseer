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
     * Get the Discord client instance
     */
    public getClient(): Client {
        return this.client;
    }
}
