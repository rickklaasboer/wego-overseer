/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';

// Magic constants
const IMAGE_OFFSETS = {
    x: 515,
    y: 370,
};

export const WinnovationMemeCommand = new Command({
    name: 'winnovation',
    description: 'winnovation meme generator',
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
            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            const img = await Jimp.read('./src/img/meme/winnovation.png');

            const signText = interaction.options.getString('sign-text')!;

            // Sign text
            img.print(font, IMAGE_OFFSETS.x, IMAGE_OFFSETS.y, {
                text: signText,
            });

            const wrappedImage = new Base64JimpImage(img);
            await interaction.reply({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: trans('errors.common.failed', 'winnovation meme'),
                ephemeral: true,
            });
        }
    },
});
