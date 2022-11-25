import {
    ChatInputCommandInteraction,
    CacheType,
    AttachmentBuilder,
} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:DeepFryCommand');

export const DeepFryCommand = new Command<
    ChatInputCommandInteraction<CacheType>
>({
    name: 'deepfry',
    description: 'deepfry image',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'image',
            description: 'deepfry image',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.ATTACHMENT,
                    name: 'image',
                    description: 'image to deepfry',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'user',
            description: 'deepfry user',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'user to deepfry profile picture from',
                    required: true,
                },
            ],
        },
    ],
    run: async (interaction) => {
        try {
            await interaction.deferReply();
            let imgURL;
            if (interaction.options.getSubcommand() == 'image') {
                const attachment = interaction.options.getAttachment('image');
                if (attachment != null) {
                    if (attachment.size >= 8_000_000)
                        throw new Error('File size too big (>=8mb)');
                    imgURL = attachment.attachment;
                }
            } else
                imgURL = interaction.options
                    .getUser('user')
                    ?.avatarURL()
                    ?.replace('.webp', '.jpeg')
                    .concat('?size=4096');

            if (imgURL == null) throw new Error('No image found');

            const img = await Jimp.read(imgURL as string);
            img.pixelate(1);
            img.contrast(1);
            img.brightness(0.2);

            const base64 = await new Promise<string>((resolve, reject) => {
                img.getBase64('image/jpeg', (err, data) => {
                    err ? reject(err) : resolve(data);
                });
            });

            const stream = Buffer.from(base64.split(',')[1], 'base64');
            const attachment = new AttachmentBuilder(stream, {
                name: 'unknown.jpg',
            });
            interaction.followUp({
                embeds: [
                    {
                        title: 'Deepfry',
                        image: {
                            url: 'attachment://unknown.jpg',
                        },
                        color: Math.floor(Math.random() * 16777214) + 1,
                        footer: {
                            text: `Requested by ${interaction.user.tag}`,
                            icon_url: interaction.user.displayAvatarURL(),
                        },
                        timestamp: new Date().toISOString(),
                    },
                ],
                files: [attachment],
            });
        } catch (err) {
            logger.fatal(err);
            interaction.followUp({
                content: 'Failed creating deepfry image :(',
            });
        }
    },
});
