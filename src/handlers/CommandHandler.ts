import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import config from '@/config';
import Logger from '@/telemetry/logger';
import {Pipeline} from '@/util/Pipeline';
import {CacheType, Interaction} from 'discord.js';
import {container, injectable} from 'tsyringe';

@injectable()
export default class CommandHandler {
    constructor(private logger: Logger) {}

    /**
     * Handle the command
     */
    public async handle(ctx: Interaction<CacheType>): Promise<void> {
        if (!ctx.isCommand()) return;
        if (!config.app.commands.has(ctx.commandName)) return;

        const command = container.resolve(
            config.app.commands.get(ctx.commandName)!,
        );

        try {
            // prettier-ignore
            const pipeline = container.resolve<Pipeline<DefaultInteraction>>(
                Pipeline
            );

            const passed = await pipeline
                .send(ctx as DefaultInteraction)
                .through(command.middleware ?? [])
                .go();

            await command.execute(passed);
        } catch (err) {
            this.logger.error(
                `Unable to execute command /${command.name} (${err})`,
            );

            // We can safely assume that the command is a slash command
            this.followUpOrReply(ctx as DefaultInteraction, command);
        }
    }

    /**
     * Follow up or reply to a command
     */
    public async followUpOrReply(
        ctx: DefaultInteraction,
        command: BaseCommand,
    ) {
        if (!ctx.replied) {
            const payload = {
                content: `Something went wrong while trying to execute /${command.name}`,
                ephemeral: true,
            };

            ctx.deferred ? ctx.followUp(payload) : ctx.reply(payload);
        }
    }
}
