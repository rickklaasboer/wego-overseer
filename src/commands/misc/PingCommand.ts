import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

@injectable()
export default class PingCommand implements BaseCommand {
    public name = 'ping';
    public description = 'Ping!';

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        await interaction.reply(
            `Pong! (${Math.abs(Date.now() - interaction.createdTimestamp)} ms)`,
        );
    }
}
