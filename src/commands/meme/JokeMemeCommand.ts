import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

const logger = new Logger('wego-overseer:commands:JokeMemeCommand');

// Magic constant
const IMAGE_OFFSET = {
    x: 5,
    y: 40,
    y_height: 190,
};

@injectable()
export default class JokeMemeCommand implements BaseCommand {
    name = 'joke';
    description = 'Other hilarious jokes you can tell yourself';
    options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 115,
        },
    ];

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

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            logger.fatal(err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'joke meme'),
                ephemeral: true,
            });
        }
    }
}
