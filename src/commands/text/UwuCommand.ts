import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    SlashCommandOption,
} from '@/commands/BaseCommand';
import UwuifyService from '@/services/misc/UwuifyService';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';

export default class UwuCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    private uwuifyService: UwuifyService;

    constructor(uwuifyService: UwuifyService) {
        super();
        this.name = 'uwu';
        this.description = 'UwUify a sentence';
        this.options = [
            {
                type: APPLICATION_COMMAND_OPTIONS.STRING,
                name: 'sentence',
                description: 'The sentence to UwUify',
                required: true,
                min_length: 1,
            },
        ];
        this.enabled = true;
        this.uwuifyService = uwuifyService;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const sentence = interaction.options.getString('sentence')!;
        await interaction.reply(this.uwuifyService.uwuify(sentence));
    }
}
