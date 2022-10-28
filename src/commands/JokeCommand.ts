import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {
    AttachmentBuilder,
    CacheType,
    ChatInputCommandInteraction,
} from 'discord.js';
import Jimp from 'jimp';

export const JokeCommand = new Command<ChatInputCommandInteraction<CacheType>>({
    name: 'joke',
    description: 'and other hilarious jokes you can tell yourself command',
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
            const font = await Jimp.loadFont(Jimp.FONT_SANS_128_BLACK);
            const img = await Jimp.read('./src/img/book.png');

            const text = interaction.options.getString('text')!;

            img.print(
                font,
                0,
                250,
                {
                    text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
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
                name: `${text.split(' ').join('-')}.png`,
            });

            interaction.reply({files: [attachment]});
        } catch (err) {
            console.error(err);
            interaction.reply({
                content: 'Failed creating joke :(',
                ephemeral: true,
            });
        }
    },
});
