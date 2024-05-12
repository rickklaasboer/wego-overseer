import Jimp from 'jimp';
import {JimpImage} from '@/util/JimpImage';
import {trans} from '@/util/localization/localization';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import Logger from '@wego/logger';

@injectable()
export default class DrakeMemeCommand implements BaseCommand {
    public name = 'drake';
    public description = 'Drake meme generator';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'top-text',
            description: 'top text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 128,
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'bottom-text',
            description: 'bottom text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 128,
        },
    ];

    constructor(private logger: Logger) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('https://i.imgur.com/EI41xgV.png');

            const topText = interaction.options.getString('top-text')!;
            const bottomText = interaction.options.getString('bottom-text')!;

            // Top text
            img.print(
                font,
                img.getWidth() / 2, // Horizontal center
                0, // Top
                {
                    text: topText,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth() / 2, // Only half of the image can be used for text
                img.getHeight() / 2, // "
            );

            // Bottom text
            img.print(
                font,
                img.getWidth() / 2, // Horizontal center
                img.getHeight() / 2, // Vertical center
                {
                    text: bottomText,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth() / 2, // Only half of the image can be used for text
                img.getHeight() / 2, // "
            );

            const wrappedImage = new JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            this.logger.fatal('Failed to generate drake meme', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'drake meme'),
                ephemeral: true,
            });
        }
    }
}
