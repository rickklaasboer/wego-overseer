/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {i18n} from '@/index';

// Magic constant
const IMAGE_OFFSET = {
    x: 5,
    y: 40,
    y_height: 190,
};

export const JokeMemeCommand = new Command({
    name: 'joke',
    description: 'x and other hilarious jokes you can tell yourself',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 115,
        },
    ],
    run: async (interaction) => {
        try {
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
            await interaction.reply({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: i18n.__('errors.common.failed', 'joke meme'),
                ephemeral: true,
            });
        }
    },
});
