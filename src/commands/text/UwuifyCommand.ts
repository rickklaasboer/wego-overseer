import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import UwuifyService from '@/services/text/UwuifyService';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class UwuifyCommand implements BaseCommand {
    public name = 'uwuify';
    public description = 'UwUify a sentence';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'Sentence to uwuify',
            required: true,
            min_length: 1,
        },
    ];

    constructor(
        private uwuifyService: UwuifyService,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const sentence = this.uwuifyService.uwuify(
                interaction.options.getString('sentence')!,
            );

            await interaction.reply(sentence);
        } catch (err) {
            this.logger.fatal('Failed to uwuify sentence', err);
        }
    }
}
