import {Client, Routes} from 'discord.js';
import {Player} from 'discord-player';
import {Knex} from 'knex';
import {container, singleton} from 'tsyringe';
import {getEnvString} from '@/util/environment';
import {Commandable} from '@/types/util';
import {DefaultInteraction} from '@/commands/BaseCommand';
import DiscordClientService from '@/services/discord/DiscordClientService';
import DiscordRestService from '@/services/discord/DiscordRestService';
import PingCommand from '@/commands/misc/PingCommand';
import LightshotCommand from '@/commands/misc/LightshotCommand';
import EmojifyCommand from '@/commands/text/EmojifyCommand';
import MockifyCommand from '@/commands/text/MockifyCommand';
import UwuifyCommand from '@/commands/text/UwuifyCommand';
import MusicCommand from '@/commands/music/MusicCommand';
import {Pipeline} from '@/util/Pipeline';
import BirthdayCommand from '@/commands/birthday/BirthdayCommand';

/**
 * @deprecated
 */
export type BotContext = {
    client: Client;
    db: Knex;
    bot: Bot;
    player: Player;
};

const DISCORD_APPLICATION_ID = getEnvString('DISCORD_APPLICATION_ID', '');
const DISCORD_TOKEN = getEnvString('DISCORD_TOKEN', '');

@singleton()
export default class Bot {
    private commandMap = new Map<string, Commandable>([
        ['ping', PingCommand],
        ['lightshot', LightshotCommand],
        ['emojify', EmojifyCommand],
        ['mockify', MockifyCommand],
        ['uwuify', UwuifyCommand],
        ['music', MusicCommand],
        ['birthday', BirthdayCommand],
    ]);

    constructor(
        private clientService: DiscordClientService,
        private restService: DiscordRestService,
    ) {}

    /**
     * Start the bot
     */
    public async start(): Promise<void> {
        await this.boot();
    }

    /**
     * Boot bot to Discord
     */
    private async boot(): Promise<void> {
        await this.register();

        await this.clientService.getClient().login(DISCORD_TOKEN);
    }

    /**
     * Register required instances
     */
    private async register(): Promise<void> {
        const commands = [...this.commandMap.entries()].map(
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
            .put(Routes.applicationCommands(DISCORD_APPLICATION_ID), {
                body: commands,
            });

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
            if (!this.commandMap.has(interaction.commandName)) return;

            const command = container.resolve(
                this.commandMap.get(interaction.commandName)!,
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
                console.error(
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
    }

    /**
     * Register events
     */
    private async registerEvents(): Promise<void> {
        //
    }

    /**
     * Register jobs
     */
    private async registerJobs(): Promise<void> {
        //
    }

    // /**
    //  * Register required instances
    //  */
    // private async register(): Promise<void> {
    //     const now = dayjs();
    //     logger.info(`Started registering`);
    //     await this._rest.put(Routes.applicationCommands(this._applicationId), {
    //         body: this._commands.map(({name, description, options}) => ({
    //             name,
    //             description,
    //             options,
    //         })),
    //     });
    //     logger.info(
    //         `Rest client sent commands to discord in ${dayjs().diff(now)}ms`,
    //     );
    //     const isReady = new Promise<void>((resolve) => {
    //         this._client.on('ready', () => resolve());
    //     });
    //     await this._client.login(this._token);
    //     await isReady;
    //     this._client.on('error', this.handleError);
    //     logger.info(
    //         `Discord client successfully logged-in in ${dayjs().diff(now)}ms`,
    //     );
    // }
    // /**
    //  * Main entry function for bot
    //  */
    // public async boot(): Promise<Client> {
    //     const now = dayjs();
    //     logger.info(`Started booting`);
    //     await this.register();
    //     this.registerCommandHandlers();
    //     this.registerEventHandlers();
    //     this.registerJobs();
    //     logger.info(`Successfully booted in ${dayjs().diff(now)}ms`);
    //     return this._client;
    // }
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
