import {trans} from '@/util/localization';
import BaseCommand, {
    SlashCommandOption,
    APPLICATION_COMMAND_OPTIONS,
} from '@/commands/BaseCommand';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import EmojifyService from '@/services/misc/EmojifyService';
import {injectable} from 'inversify';

@injectable()
export default class EmojifyCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    private emojifyService: EmojifyService;

    constructor(emojifyService: EmojifyService) {
        super();
        this.name = 'emojify';
        this.description = 'Emojify a sentence';
        this.options = [
            {
                type: APPLICATION_COMMAND_OPTIONS.STRING,
                name: 'sentence',
                description: 'The sentence to emojify',
                required: true,
                min_length: 1,
            },
        ];
        this.enabled = true;
        this.emojifyService = emojifyService;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        try {
            const sentence = interaction.options.getString('sentence')!;
            await interaction.reply(this.emojifyService.emojify(sentence));
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: trans('errors.common.failed', 'emojify'),
                ephemeral: true,
            });
        }
    }
}
