import config from '@/config';
import {tap} from '@/util/misc/tap';
import {REST} from 'discord.js';
import {singleton} from 'tsyringe';

@singleton()
export default class DiscordRestService {
    private rest: REST;

    constructor() {
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(config.discord.token);
        });
    }

    /**
     * Get the Discord REST instance
     */
    public getRest(): REST {
        return this.rest;
    }
}
