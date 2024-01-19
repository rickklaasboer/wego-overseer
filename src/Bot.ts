import {Client, Routes} from 'discord.js';
import {Player} from 'discord-player';
import {Knex} from 'knex';
import {container, singleton} from 'tsyringe';
import config from '@/config';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import DiscordRestService from '@/app/services/discord/DiscordRestService';
import Logger from '@/telemetry/logger';
import dayjs from 'dayjs';
import BaseEvent, {EventKeys} from '@/app/events/BaseEvent';
import CommandHandler from '@/handlers/CommandHandler';
import EventHandler from '@/handlers/EventHandler';

/**
 * @deprecated
 */
export type BotContext = {
    client: Client;
    db: Knex;
    bot: Bot;
    player: Player;
};

@singleton()
export default class Bot {
    constructor(
        private clientService: DiscordClientService,
        private restService: DiscordRestService,
        private commandHandler: CommandHandler,
        private eventHandler: EventHandler,
        private logger: Logger,
    ) {}

    /**
     * Start the bot
     */
    public async start(): Promise<void> {
        const now = dayjs();
        this.logger.info('Starting bot...');

        await this.boot();

        this.logger.info(`Successfully started in ${dayjs().diff(now)}ms`);

        const tag = this.clientService.getClient().user?.tag;
        this.logger.info(
            `Discord client ready and listening as ${tag} in ${dayjs().diff(
                now,
            )}ms`,
        );
    }

    /**
     * Boot bot to Discord
     */
    private async boot(): Promise<void> {
        this.logger.info('Booting bot...');
        const now = dayjs();
        await this.register();

        await this.clientService.getClient().login(config.discord.token);

        this.logger.info(`Successfully booted in ${dayjs().diff(now)}ms`);
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        const now = dayjs();
        const commands = [...config.app.commands.entries()].map(
            ([, resolvable]) => {
                const command = container.resolve(resolvable);
                return {
                    name: command.name,
                    description: command.description,
                    options: command.options,
                };
            },
        );

        await this.restService
            .getRest()
            .put(Routes.applicationCommands(config.discord.applicationId), {
                body: commands,
            });

        this.logger.info(
            `Rest client sent commands to discord in ${dayjs().diff(now)}ms`,
        );

        await this.registerCommands();
        await this.registerEvents();
        await this.registerJobs();
    }

    /**
     * Register commands
     */
    private async registerCommands(): Promise<void> {
        const client = this.clientService.getClient();

        client.on('interactionCreate', async (interaction) => {
            await this.commandHandler.handle(interaction);
        });

        this.logger.info(
            `Successfully registered ${
                config.app.commands.size
            } commands(s) ([${Array.from(config.app.commands.keys()).join(
                ', ',
            )}])`,
        );
    }

    /**
     * Register events
     */
    private async registerEvents(): Promise<void> {
        for (const [, resolvable] of config.app.events.entries()) {
            const event = container.resolve<BaseEvent<EventKeys>>(resolvable);
            const client = this.clientService.getClient();

            client.on(event.event, async (...args) => {
                await this.eventHandler.handle(event, ...args);
            });
        }

        this.logger.info(
            `Successfully registered ${
                config.app.events.size
            } event(s) ([${Array.from(config.app.events.keys()).join(', ')}])`,
        );
    }

    /**
     * Register jobs
     */
    private async registerJobs(): Promise<void> {
        this.logger.info(
            `Successfully registered ${
                config.app.jobs.size
            } job(s) ([${Array.from(config.app.jobs.keys()).join(', ')}])`,
        );
    }

    // /**
    //  * Register jobs
    //  */
    // private registerJobs(): void {
    //     for (const {job, onTick} of this._jobs) {
    //         job.addCallback(async () => await onTick(this._ctx));
    //         job.start();
    //     }
    //     logger.info(
    //         `Successfully registered ${this._jobs.length} job(s) ([${this._jobs
    //             .map(({name}) => name)
    //             .join(', ')}])`,
    //     );
    // }
}
