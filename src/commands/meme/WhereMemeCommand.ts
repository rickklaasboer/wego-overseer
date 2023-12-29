import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {trans} from '@/util/localization';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:commands:WhereMemeCommand');

// Magic constants
const IMAGE_OFFSETS = {
    x: -32,
    y: 24,
};

export const WhereMemeCommand = new Command({
    name: 'where',
    description: 'where x meme generator',
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
            const font = await Jimp.loadFont(Jimp.FONT_SANS_64_BLACK);
            const img = await Jimp.read('./src/img/meme/monke.png');

            let text = interaction.options.getString('text')!;
            if (!text.toLowerCase().startsWith('where')) {
                text = trans('commands.where.text', text);
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
            await interaction.followUp({files: [wrappedImage.toAttachment()]});
        } catch (err) {
            logger.fatal(err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'where meme'),
                ephemeral: true,
            });
        }
    },
});
