import {Client, Routes} from 'discord.js';
import {Player} from 'discord-player';
import {Knex} from 'knex';
import {container, singleton} from 'tsyringe';
import {DefaultInteraction} from '@/commands/BaseCommand';
import {Pipeline} from '@/util/Pipeline';
import config from '@/config';
import DiscordClientService from '@/services/discord/DiscordClientService';
import DiscordRestService from '@/services/discord/DiscordRestService';
import Logger from '@/telemetry/logger';
import dayjs from 'dayjs';

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
            if (!interaction.isCommand()) return;
            if (!config.app.commands.has(interaction.commandName)) return;

            const command = container.resolve(
                config.app.commands.get(interaction.commandName)!,
            );

            try {
                const pipeline =
                    container.resolve<Pipeline<DefaultInteraction>>(Pipeline);

                const passed = await pipeline
                    .send(interaction as DefaultInteraction)
                    .through(command.middleware ?? [])
                    .go();

                await command.execute(passed);
            } catch (err) {
                this.logger.error(
                    `Unable to execute command /${command.name} (${err})`,
                );

                if (!interaction.replied) {
                    const payload = {
                        content: `Something went wrong while trying to execute /${command.name}`,
                        ephemeral: true,
                    };

                    interaction.deferred
                        ? interaction.followUp(payload)
                        : interaction.reply(payload);
                }
            }
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
    //  * Register event handlers
    //  */
    // private registerEventHandlers(): void {
    //     for (const event of this._events) {
    //         if (event.enabled) {
    //             this._client.on(event.name, (...args) => {
    //                 event.run(this._ctx, ...args);
    //             });
    //         }
    //     }
    //     logger.info(
    //         `Successfully registered ${
    //             this._events.length
    //         } event(s) ([${this._events.map(({name}) => name).join(', ')}])`,
    //     );
    // }
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
