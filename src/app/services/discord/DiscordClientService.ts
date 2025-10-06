import config from '@/config';
import { ActivityType, Client, IntentsBitField, Partials } from 'discord.js';
import { singleton } from 'tsyringe';

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
     * Login bot to the Discord API
     * @param token 
     */
    public async login(token: string): Promise<void> {
        await this.client.login(token)
    }

    /**
     * Get the bot's tag
     */
    public tag(): string {
        return this.client.user?.tag ?? 'Unknown';
    }

    /**
     * Set the bot's activity
     * @param version 
     */
    public setActivity(version: string) {
        this.client.user?.setActivity({
            name: `version ${version}`,
            type: ActivityType.Playing,
        });
    }

    /**
     * Get the Discord client instance
     */
    public getClient(): Client {
        return this.client;
    }
}
