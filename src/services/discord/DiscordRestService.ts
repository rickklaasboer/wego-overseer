import {getEnvString} from '@/util/environment';
import {tap} from '@/util/tap';
import {REST} from 'discord.js';
import {singleton} from 'tsyringe';

const DISCORD_TOKEN = getEnvString('DISCORD_TOKEN', '');

@singleton()
export default class DiscordRestService {
    private rest: REST;

    constructor() {
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(DISCORD_TOKEN);
        });
    }

    /**
     * Get the Discord REST instance
     */
    public getRest(): REST {
        return this.rest;
    }
}
