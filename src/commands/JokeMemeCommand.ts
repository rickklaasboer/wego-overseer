import {
    ChatInputCommandInteraction,
    CacheType,
    AttachmentBuilder,
} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';

// Magic constant
const IMAGE_OFFSET = {
    y: 120,
};

export const JokeMemeCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'joke',
    description: 'x and other hilarious jokes you can tell yourself',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 26,
        },
    ],
    run: async (interaction) => {
        try {
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);
            const img = await Jimp.read('./src/img/joke.png');

            const text =
                interaction.options.getString('text') ?? 'this bot is a joke';

            img.print(
                font,
                img.getWidth() / 2 - text.length * 7, // Calculate text position
                IMAGE_OFFSET.y,
                {
                    text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_LEFT,
                    alignmentY: Jimp.VERTICAL_ALIGN_TOP,
                },
                img.getWidth(),
                img.getHeight(),
            );

            const base64 = await new Promise<string>((resolve, reject) => {
                img.getBase64('image/png', (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });

            const stream = Buffer.from(base64.split(',')[1], 'base64');
            const attachment = new AttachmentBuilder(stream, {
                name: 'unknown.png',
            });

            interaction.reply({files: [attachment]});
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: 'Failed creating joke meme :(',
                ephemeral: true,
            });
        }
    },
});
