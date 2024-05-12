import {
    DefaultInteraction,
    SlashCommandOption,
} from '@/app/commands/BaseCommand';
import config from '@/config';
import Logger from '@wego/logger';
import {Maybe} from '@/types/util';
import {Pipeline} from '@/util/Pipeline';
import {AuthorizationError} from '@/util/errors/AuthorizationError';
import {trans} from '@/util/localization/localization';
import {wrapReply} from '@/util/misc/discord';
import {app} from '@/util/misc/misc';
import {CacheType, Interaction} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class CommandHandler {
    constructor(private logger: Logger) {}

    /**
     * Handle the command
     */
    public async handle(ctx: Interaction<CacheType>): Promise<void> {
        if (!ctx.isChatInputCommand()) return;
        if (!config.app.commands.has(ctx.commandName)) return;

        const command = app(config.app.commands.get(ctx.commandName)!);

        try {
            const pipeline = app<Pipeline<DefaultInteraction>>(Pipeline);

            const passed = await pipeline
                .send(ctx as DefaultInteraction)
                .through(command.middleware ?? [])
                .go();

            await command.execute(passed);
        } catch (err) {
            if (err instanceof AuthorizationError) {
                await wrapReply(ctx, {
                    content: trans(err.message),
                });
                return;
            }

            this.logger.error(
                `Failed to execute command /${command.name} (${err})`,
            );

            await wrapReply(ctx, {
                content: `Something went wrong while trying to execute /${command.name}`,
                ephemeral: true,
            });
        }
    }

    /**
     * Get commands to send to Discord REST API
     */
    public getRestable(): {
        name: string;
        description: string;
        options: Maybe<SlashCommandOption[]>;
    }[] {
        return [...config.app.commands.entries()].map(([, resolvable]) => {
            const command = app(resolvable);
            return {
                name: command.name,
                description: command.description,
                options: command.options,
            };
        });
    }
}
