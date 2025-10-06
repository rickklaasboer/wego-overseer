import config from '@/config';
import {tap} from '@/util/misc/tap';
import {RequestData, REST, Routes} from 'discord.js';
import {singleton} from 'tsyringe';

@singleton()
export default class DiscordRestService {
    private rest: REST;

    constructor() {
        this.rest = tap(new REST({version: '9'}), (rest) => {
            rest.setToken(config.discord.token);
        });
    }

    public async putApplicationCommands(body: RequestData['body']): Promise<void> {
        await this.rest.put(Routes.applicationCommands(config.discord.applicationId), {
                body
            });
    }

    /**
     * Get the Discord REST instance
     */
    public getRest(): REST {
        return this.rest;
    }
}
