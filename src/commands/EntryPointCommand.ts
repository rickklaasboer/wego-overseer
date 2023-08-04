import {BotContext} from '@/Bot';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {Props as CommandProps} from './Command';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';
import {Maybe} from '@/types/util';

type Interaction = ChatInputCommandInteraction<CacheType>;

type Props = Omit<CommandProps<Interaction>, 'run'> & {
    forwardables: Map<string, Command>;
    logger?: Logger;
};

export default class EntryPointCommand extends Command<Interaction> {
    forwardables: Map<string, Command>;
    logger?: Maybe<Logger> = null;

    constructor({forwardables, logger, ...restProps}: Props) {
        super({...restProps, run: () => Promise.resolve()});
        this.run = this._run;
        this.forwardables = forwardables;
        this.logger = logger;
    }

    private async _run(
        interaction: Interaction,
        self: Command<Interaction>,
        ctx: BotContext,
    ): Promise<void> {
        try {
            const cmd = interaction.options.getSubcommand();

            if (!this.forwardables.has(cmd)) {
                throw new Error(`Invalid subcommand ${cmd}`);
            }
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const forwardable = this.forwardables.get(cmd)!;

            if (forwardable.shouldDeferReply) {
                await interaction.deferReply();
            }

            await self.forwardTo(forwardable, interaction, ctx);
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
