import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import MockifyService from '@/services/text/MockifyService';
import {injectable} from 'tsyringe';

@injectable()
export default class MockifyCommand implements BaseCommand {
    public name = 'mockify';
    public description = 'Mockify a sentence';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'Sentence to mockify',
            required: true,
            min_length: 1,
        },
    ];

    constructor(private mockifyService: MockifyService) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const sentence = this.mockifyService.mockify(
            interaction.options.getString('sentence')!,
        );
        await interaction.reply(sentence);
    }
}
