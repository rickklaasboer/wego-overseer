import {BotContext} from '@/Bot';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {Props as CommandProps} from './Command';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';
import {Maybe} from '@/types/util';

type Interaction = ChatInputCommandInteraction<CacheType>;

type Props = Omit<CommandProps<Interaction>, 'run'> & {
    forwardables: Map<string, Command<Interaction>>;
    logger?: Logger;
};

export default class EntryPointCommand extends Command {
    forwardables: Map<string, Command>;
    logger?: Maybe<Logger> = null;

    constructor({forwardables, logger, ...restProps}: Props) {
        super({...restProps, run: () => Promise.resolve()});
        this._run = this.wrappedRun;
        this.forwardables = forwardables;
        this.logger = logger;
    }

    protected async wrappedRun(
        interaction: Interaction,
        self: Command,
        ctx: BotContext,
    ): Promise<void> {
        try {
            await interaction.deferReply();

            const cmd = interaction.options.getSubcommand();

            if (!this.forwardables.has(cmd)) {
                throw new Error(`Invalid subcommand ${cmd}`);
            }

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            await self.forwardTo(this.forwardables.get(cmd)!, interaction, ctx);
        } catch (err) {
            this.logger?.fatal(
                `Unable to handle ${this.name}`,
                interaction,
                err,
            );
            if (!interaction.replied) {
                await interaction.editReply(
                    trans('errors.common.command.unknown_error'),
                );
            }
        }
    }
}
