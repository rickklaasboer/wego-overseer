/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {i18n} from '@/index';

// Magic constants
const IMAGE_OFFSETS = {
    x: -32,
    y: 24,
};

export const WhereMemeCommand = new Command({
    name: 'where',
    description: 'where x meme generator',
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
            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            const img = await Jimp.read('./src/img/meme/monke.png');

            let text = interaction.options.getString('text')!;
            if (!text.toLowerCase().startsWith('where')) {
                text = `where ${text}`;
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
            await interaction.reply({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: i18n.__('errors.common.failed', 'where meme'),
                ephemeral: true,
            });
        }
    },
});
