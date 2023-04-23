import {BotContext} from '@/Bot';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {Props as CommandProps} from './Command';
import {trans} from '@/util/localization';

type Interaction = ChatInputCommandInteraction<CacheType>;

type Props = Omit<CommandProps<Interaction>, 'run'> & {
    forwardables: Map<string, Command>;
};

export default class EntryPointCommand extends Command<Interaction> {
    forwardables: Map<string, Command>;

    constructor({forwardables, ...restProps}: Props) {
        super({...restProps, run: () => Promise.resolve()});
        this.run = this._run;
        this.forwardables = forwardables;
    }

    private async _run(
        interaction: Interaction,
        self: Command<Interaction>,
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
            if (!interaction.replied) {
                await interaction.editReply(
                    trans('errors.common.command.unknown_error'),
                );
            }
        }
    }
}
