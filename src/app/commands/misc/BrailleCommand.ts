import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import BrailleService from '@/app/services/BrailleService';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class BrailleCommand implements BaseCommand {
    public name = 'braille';
    public description = 'Convert text to braille!';
    public options = [
        {
            name: 'text',
            description: 'Text to convert',
            type: APPLICATION_COMMAND_OPTIONS.STRING,
        },
    ];

    constructor(
        private brailleService: BrailleService,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            await interaction.reply(
                this.brailleService.toBraille(
                    interaction.options.getString('text') ?? '',
                ),
            );
        } catch (err) {
            this.logger.fatal(
                'Failed to ping, I have no idea how this will ever happen but here we are',
                err,
            );
        }
    }
}
