import Jimp from 'jimp';
import {JimpImage} from '@/util/JimpImage';
import {trans} from '@/util/localization';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

// Magic constants
const IMAGE_OFFSETS = {
    heightOffset: 96,
    x: 24,
    y: 12,
};

@injectable()
export default class MarieKondoCommand implements BaseCommand {
    public name = 'mariekondo';
    public description = 'Does not spark joy';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 32,
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
            const img = await Jimp.read('https://i.imgur.com/kwfd7Y3.png');

            // Create room for text on top of image
            img.contain(
                img.getWidth(),
                img.getHeight() + IMAGE_OFFSETS.heightOffset,
                Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_BOTTOM,
            );

            // Change background color to white (as our text will be black)
            // 4294967295 equals #FFFFFF as described by https://ffffffff.net/
            img.background(4294967295);

            // Finally, add text to our image
            const text = interaction.options.getString('text')!;
            img.print(
                font,
                IMAGE_OFFSETS.x,
                IMAGE_OFFSETS.y,
                {
                    text: trans('commands.mariekondo.text', text),
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP,
                },
                // Subtract offset x from image width to make text rollover correctly
                img.getWidth() - IMAGE_OFFSETS.x,
                img.getHeight(),
            );

            const wrappedImage = new JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            this.logger.fatal('Failed to create marie kondo meme', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'marie kondo meme'),
                ephemeral: true,
            });
        }
    }
}
