import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import EmojifyService from '@/services/text/EmojifyService';
import {injectable} from 'tsyringe';

@injectable()
export default class EmojifyCommand implements BaseCommand {
    name = 'emojify';
    description = 'Emojify a sentence';
    options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'The sentence to emojify',
            required: true,
            min_length: 1,
        },
    ];

    constructor(private emojifyService: EmojifyService) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const sentence = this.emojifyService.emojify(
            interaction.options.getString('sentence')!,
        );

        await interaction.reply(sentence);
    }
}
