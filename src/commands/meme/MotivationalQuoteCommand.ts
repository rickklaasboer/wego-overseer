import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import Logger from '@/telemetry/logger';
import {i18n} from '@/index';
import fetch from "node-fetch";

const logger = new Logger('wego-overseer:MotivationalQuoteCommand');

//https://picsum.photos/width/height
//https://picsum.photos/
const imageUrl = "https://picsum.photos/300/400?grayscale&blur=5";

export const MotivationalQuoteCommand = new Command
<ChatInputCommandInteraction<CacheType>
>({
    name: 'motivational',
    description: 'Generate a motivational picture',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'text',
            description: 'text that will appear in meme',
            required: true,
            min_length: 1,
            max_length: 32,
        }
    ],
    run: async (interaction) => {
        try{
            const font = await Jimp.loadFont(Jimp.FONT_SANS_32_BLACK);

            const text = interaction.options.getString('text')!;

            //feeding the link directly to Jimp doesn't work.
            const response = await fetch(imageUrl);
            const buffer = Buffer.from(await response.arrayBuffer());
            const img = await Jimp.read(buffer);

            img.print(
                font,
                0,
                0,
                {
                    text: text,
                    alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                    alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
                },
                img.getWidth(),
                img.getHeight(),
            );
            
            const wrappedImage = new Base64JimpImage(img);
            await interaction.reply({files: [wrappedImage.toAttachment()]});
        }
        catch (err) {
            logger.fatal('Failed creating motivational quote meme', err);
            await interaction.reply({
                content: i18n.__('errors.common.failed', 'Motivational Quote Command'),
                ephemeral: true,
            });
        }
    }
});