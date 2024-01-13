import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import UwuifyService from '@/services/text/UwuifyService';
import {injectable} from 'tsyringe';

@injectable()
export default class UwuifyCommand implements BaseCommand {
    name = 'uwuify';
    description = 'UwUify a sentence';
    options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'Sentence to uwuify',
            required: true,
            min_length: 1,
        },
    ];

    constructor(private uwuifyService: UwuifyService) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const sentence = this.uwuifyService.uwuify(
            interaction.options.getString('sentence')!,
        );
        await interaction.reply(sentence);
    }
}