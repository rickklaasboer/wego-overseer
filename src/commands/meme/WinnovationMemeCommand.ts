/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:commands:WinnovationMemeCommand');

// Magic constants
const IMAGE_OFFSETS = {
    x: 330,
    y: 360,
};

export const WinnovationMemeCommand = new Command({
    name: 'winnovation',
    description: 'winnovation meme generator',
    shouldDeferReply: true,
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sign-text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 16,
        },
    ],
    run: async (interaction) => {
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/meme/winnovation.png');
            const fontCanvas = await Jimp.create(
                img.getWidth(),
                img.getHeight(),
            );
            const signText = interaction.options.getString('sign-text')!;

            // Sign text
            fontCanvas
                .print(font, 0, 0, {
                    text: signText,
                })
                .resize(
                    fontCanvas.getWidth() * 1.4,
                    fontCanvas.getHeight() * 1.4,
                )
                .rotate(-8);
            img.blit(fontCanvas, IMAGE_OFFSETS.x, IMAGE_OFFSETS.y);

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            logger.fatal(err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'winnovation meme'),
                ephemeral: true,
            });
        }
    },
});
