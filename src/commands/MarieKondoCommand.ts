/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import Logger from '@/telemetry/logger';
import {i18n} from '@/index';

const logger = new Logger('wego-overseer:MarieKondoCommand');

// Magic constants
const IMAGE_OFFSETS = {
    heightOffset: 96,
    x: 24,
    y: 12,
};

export const MarieKondoCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'mariekondo',
    description: 'x does not spark joy',
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
            const img = await Jimp.read('./src/img/marie.png');

            // Create room for text on top of image
            img.contain(
                img.getWidth(),
                img.getHeight() + IMAGE_OFFSETS.heightOffset,
                Jimp.HORIZONTAL_ALIGN_CENTER | Jimp.VERTICAL_ALIGN_BOTTOM,
            );

            // Change background color to white (as our will be text black)
            // 4294967295 equals #FFFFFF as described by https://ffffffff.net/
            img.background(4294967295);

            // Finally, add text to our image
            const text = interaction.options.getString('text')!;
            img.print(
                font,
                IMAGE_OFFSETS.x,
                IMAGE_OFFSETS.y,
                {
                    text: `${text} does not spark joy`,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP,
                },
                // Subtract offset x from image width to make text rollover correctly
                img.getWidth() - IMAGE_OFFSETS.x,
                img.getHeight(),
            );

            const wrappedImage = new Base64JimpImage(img);
            await interaction.reply({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            logger.fatal('Failed creating marie kondo meme', err);
            await interaction.reply({
                content: i18n.__('errors.common.failed', 'marie kondo meme'),
                ephemeral: true,
            });
        }
    },
});
