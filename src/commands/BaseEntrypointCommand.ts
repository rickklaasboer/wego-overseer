import BaseCommand, {
    DefaultInteraction,
    SlashCommandOption,
} from '@/commands/BaseCommand';
import {Commandable} from '@/types/util';
import {Pipeline} from '@/util/Pipeline';
import {container} from 'tsyringe';

export default abstract class BaseEntrypointCommand implements BaseCommand {
    public abstract name: string;
    public abstract description: string;
    public abstract forwardables: Map<string, Commandable>;
    public abstract options?: SlashCommandOption[];
    public abstract enabled?: boolean;

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        await interaction.deferReply();

        const subcommand = interaction.options.getSubcommand();

        if (!this.forwardables.has(subcommand)) {
            throw new Error(`Invalid subcommand ${subcommand}`);
        }

        const resolvable = this.forwardables.get(subcommand)!;
        const command = container.resolve(resolvable);

        const pipeline =
            container.resolve<Pipeline<DefaultInteraction>>(Pipeline);

        const passed = await pipeline
            .send(interaction as DefaultInteraction)
            .through(command.middleware ?? [])
            .go();

        await command.execute(passed);
    }
}
