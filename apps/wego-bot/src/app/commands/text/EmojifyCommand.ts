import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import EmojifyService from '@/app/services/text/EmojifyService';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';

@injectable()
export default class EmojifyCommand implements BaseCommand {
    public name = 'emojify';
    public description = 'Emojify a sentence';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'The sentence to emojify',
            required: true,
            min_length: 1,
        },
    ];

    constructor(
        private emojifyService: EmojifyService,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const sentence = this.emojifyService.emojify(
                interaction.options.getString('sentence')!,
            );

            await interaction.reply(sentence);
        } catch (err) {
            this.logger.fatal('Failed to emojify sentence', err);
        }
    }
}
