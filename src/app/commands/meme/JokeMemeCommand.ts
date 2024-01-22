import Jimp from 'jimp';
import {JimpImage} from '@/util/JimpImage';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';

// Magic constant
const IMAGE_OFFSET = {
    x: 5,
    y: 40,
    y_height: 190,
};

@injectable()
export default class JokeMemeCommand implements BaseCommand {
    public name = 'joke';
    public description = 'Other hilarious jokes you can tell yourself';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 115,
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
            const img = await Jimp.read('./src/img/meme/joke.png');

            const text = interaction.options.getString('text')!;

            img.print(
                font,
                IMAGE_OFFSET.x,
                IMAGE_OFFSET.y,
                {
                    text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth(),
                IMAGE_OFFSET.y_height,
            );

            const wrappedImage = new JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            this.logger.fatal('Failed to create joke meme', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'joke meme'),
                ephemeral: true,
            });
        }
    }
}
