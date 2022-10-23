import {
    ChatInputCommandInteraction,
    CacheType,
    AttachmentBuilder,
} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';

// Magic constants
const IMAGE_OFFSETS = {
    x: -32,
    y: 24,
};

export const WhereMemeCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
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
            const img = await Jimp.read('./src/img/monke.png');

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
                content: 'Failed creating where meme :(',
                ephemeral: true,
            });
        }
    },
});
