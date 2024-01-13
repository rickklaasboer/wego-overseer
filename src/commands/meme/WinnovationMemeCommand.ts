import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

// Magic constants
const IMAGE_OFFSETS = {
    x: 330,
    y: 360,
};

@injectable()
export default class WinnovationMemeCommand implements BaseCommand {
    public name = 'winnovation';
    public description = 'Winnovation meme generator';
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sign-text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 16,
        },
    ];

    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            await interaction.deferReply();

            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/meme/winnovation.png');
            const canvas = await Jimp.create(img.getWidth(), img.getHeight());
            const signText = interaction.options.getString('sign-text')!;

            // Sign text
            canvas
                .print(font, 0, 0, {
                    text: signText,
                })
                .resize(canvas.getWidth() * 1.4, canvas.getHeight() * 1.4)
                .rotate(-8);

            img.blit(canvas, IMAGE_OFFSETS.x, IMAGE_OFFSETS.y);

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            await interaction.followUp({
                content: trans('errors.common.failed', 'winnovation meme'),
                ephemeral: true,
            });
        }
    }
}
