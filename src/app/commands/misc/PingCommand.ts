import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class PingCommand implements BaseCommand {
    public name = 'ping';
    public description = 'Ping!';

    constructor(private logger: Logger) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            await interaction.reply(
                `Pong! (${Math.abs(
                    Date.now() - interaction.createdTimestamp,
                )} ms)`,
            );
        } catch (err) {
            this.logger.fatal(
                'Failed to ping, I have no idea how this will ever happen but here we are',
                err,
            );
        }
    }
}
