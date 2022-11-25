import {
    ChatInputCommandInteraction,
    CacheType,
    AttachmentBuilder,
} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';

export const DrakeMemeCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'drake',
    description: 'drake meme generator',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'top-text',
            description: 'top text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 128,
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'bottom-text',
            description: 'bottom text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 128,
        },
    ],
    run: async (interaction) => {
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/drake.png');

            const topText = interaction.options.getString('top-text')!;
            const bottomText = interaction.options.getString('bottom-text')!;

            // Top text
            img.print(
                font,
                img.getWidth() / 2, // Horizontal center
                0, // Top
                {
                    text: topText,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth() / 2, // Only half of the image can be used for text
                img.getHeight() / 2, // "
            );

            // Bottom text
            img.print(
                font,
                img.getWidth() / 2, // Horizontal center
                img.getHeight() / 2, // Vertical center
                {
                    text: bottomText,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth() / 2, // Only half of the image can be used for text
                img.getHeight() / 2, // "
            );

            const base64 = await new Promise<string>((resolve, reject) => {
                img.getBase64('image/jpeg', (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });

            const stream = Buffer.from(base64.split(',')[1], 'base64');
            const attachment = new AttachmentBuilder(stream, {
                name: 'unknown.jpg',
            });

            interaction.reply({files: [attachment]});
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: 'Failed creating drake meme :(',
                ephemeral: true,
            });
        }
    },
});
