import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    SlashCommandOption,
} from '@/commands/BaseCommand';
import MockifyService from '@/services/misc/MockifyService';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {injectable} from 'inversify';

@injectable()
export default class MockifyCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    private mockifyService: MockifyService;

    constructor(mockifyService: MockifyService) {
        super();
        this.name = 'mockify';
        this.description = 'transform text to spongebob mocking';
        this.options = [
            {
                type: APPLICATION_COMMAND_OPTIONS.STRING,
                name: 'text',
                description: 'text to be transformed',
                required: true,
                min_length: 1,
            },
        ];
        this.enabled = true;
        this.mockifyService = mockifyService;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const text = interaction.options.getString('text')!;
        await interaction.reply(this.mockifyService.mockify(text));
    }
}
