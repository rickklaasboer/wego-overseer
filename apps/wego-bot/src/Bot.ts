import {ActivityType, Routes} from 'discord.js';
import {singleton} from 'tsyringe';
import config from '@/config';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import DiscordRestService from '@/app/services/discord/DiscordRestService';
import dayjs from 'dayjs';
import BaseEvent, {EventKeys} from '@/app/events/BaseEvent';
import CommandHandler from '@/handlers/CommandHandler';
import EventHandler from '@/handlers/EventHandler';
import JobHandler from '@/handlers/JobHandler';
import BaseJob from '@/app/jobs/BaseJob';
import {app} from '@/util/misc/misc';
import Logger from '@wego/logger';

@singleton()
export default class Bot {
    constructor(
        private clientService: DiscordClientService,
        private restService: DiscordRestService,
        private commandHandler: CommandHandler,
        private eventHandler: EventHandler,
        private jobHandler: JobHandler,
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

        this.setBotActivity();

        this.logger.info(`Successfully booted in ${dayjs().diff(now)}ms`);
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        const now = dayjs();

        await this.restService
            .getRest()
            .put(Routes.applicationCommands(config.discord.applicationId), {
                body: this.commandHandler.getRestable(),
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
            const event = app<BaseEvent<EventKeys>>(resolvable);
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
        for (const [, resolvable] of config.app.jobs.entries()) {
            const job = app<BaseJob>(resolvable);
            this.jobHandler.handle(job);
        }

        this.logger.info(
            `Successfully registered ${
                config.app.jobs.size
            } job(s) ([${Array.from(config.app.jobs.keys()).join(', ')}])`,
        );
    }

    /**
     * Set bot activity
     */
    private setBotActivity(): void {
        const client = this.clientService.getClient();
        const version = process.env.APP_VERSION;

        client.user?.setActivity({
            name: `version ${version}`,
            type: ActivityType.Playing,
        });
    }
}
