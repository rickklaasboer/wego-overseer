import DiscordClientService from '@/services/discord/DiscordClientService';
import {Player} from 'discord-player';
import {singleton} from 'tsyringe';

@singleton()
export default class DiscordPlayerService {
    private player: Player;
    private didLoadExtractors = false;

    constructor(private discordClient: DiscordClientService) {
        this.player = new Player(this.discordClient.getClient());
    }

    /**
     * Get the player
     */
    public async getPlayer(): Promise<Player> {
        // Load extractors if not loaded
        // This is the reason why this function has to be asyncronous
        // I don't like it either, but it be like that sometimes
        if (!this.didLoadExtractors) {
            await this.player.extractors.loadDefault();

            // Prevent loading extractors again
            this.didLoadExtractors = true;
        }

        return this.player;
    }
}
