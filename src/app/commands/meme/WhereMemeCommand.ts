import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

// Magic constants
const IMAGE_OFFSETS = {
    x: -32,
    y: 24,
};

@injectable()
export default class WhereMemeCommand implements BaseCommand {
    public name = 'where';
    public description = 'Where monke meme generator';
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

            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            const img = await Jimp.read('./src/img/meme/monke.png');

            let text = interaction.options.getString('text')!;
            if (!text.toLowerCase().startsWith('where')) {
                text = trans('commands.where.text', text);
            }

            img.print(
                font,
                IMAGE_OFFSETS.x,
                IMAGE_OFFSETS.y,
                {
                    text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_RIGHT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP,
                },
                img.getWidth(),
                img.getHeight(),
            );

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            this.logger.fatal('Failed to generate where meme', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'where meme'),
                ephemeral: true,
            });
        }
    }
}
