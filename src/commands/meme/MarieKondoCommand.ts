/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:commands:MarieKondoCommand');

// Magic constants
const IMAGE_OFFSETS = {
    heightOffset: 96,
    x: 24,
    y: 12,
};

export const MarieKondoCommand = new Command({
    name: 'mariekondo',
    description: 'x does not spark joy',
    shouldDeferReply: true,
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 32,
        },
    ],
    run: async (interaction) => {
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/meme/marie.png');

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

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            logger.fatal('Failed creating marie kondo meme', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'marie kondo meme'),
                ephemeral: true,
            });
        }
    },
});
