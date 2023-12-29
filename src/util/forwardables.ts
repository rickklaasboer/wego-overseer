import {DefaultInteraction} from '@/commands/BaseCommand';
import {Container} from 'inversify';

/**
 *
 */
export async function withForward<
    T extends DefaultInteraction = DefaultInteraction,
>(interaction: T, forwardables: Map<string, any>, container: Container) {
    try {
        await interaction.deferReply();

        const cmd = interaction.options.getSubcommand();

        if (!forwardables.has(cmd)) {
            throw new Error(`Invalid subcommand ${cmd}`);
        }

        const forwardable = container.resolve(forwardables.get(cmd)!) as any;
        await forwardable.execute(interaction);
    } catch (err) {
        console.error(err);
    }
}
