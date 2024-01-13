import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

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

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/meme/drake.png');

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

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            await interaction.followUp({
                content: trans('errors.common.failed', 'drake meme'),
                ephemeral: true,
            });
        }
    }
}
