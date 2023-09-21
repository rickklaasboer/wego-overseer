import {
    ChatInputCommandInteraction,
    CacheType,
    MessagePayload,
    InteractionReplyOptions,
    EmbedBuilder,
} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Jimp from 'jimp';
import Logger from '@/telemetry/logger';
import {Base64JimpImage} from '@/util/Base64JimpImage';
import {Maybe} from '@/types/util';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:commands:DeepFryCommand');

/**
 * Create follow up reply from interaction and image
 */
function createFollowUp(
    interaction: ChatInputCommandInteraction<CacheType>,
    image: Base64JimpImage,
): string | MessagePayload | InteractionReplyOptions {
    const embed = new EmbedBuilder()
        .setTitle('Deepfry')
        .setImage('attachment://unknown.jpg')
        .setColor(Math.floor(Math.random() * 16777214) + 1)
        .setFooter({
            text: `Requested by ${interaction.user.tag}`,
            iconURL: interaction.user.displayAvatarURL(),
        })
        .setTimestamp(new Date());

    return {
        embeds: [embed],
        files: [image.toAttachment()],
    };
}

/**
 * Get initiatior avatar url from interaction
 */
function getUserAvatarUrl(
    interaction: ChatInputCommandInteraction<CacheType>,
): Maybe<string> {
    return interaction.options
        .getUser('user')
        ?.avatarURL()
        ?.replace('.webp', '.jpeg')
        .concat('?size=4096');
}

/**
 * Get image url from interaction
 */
function getImageUrl(
    interaction: ChatInputCommandInteraction<CacheType>,
): Maybe<string> {
    if (interaction.options.getSubcommand() === 'image') {
        const attachment = interaction.options.getAttachment('image');
        if (attachment && !(attachment.size >= 8_000_000)) {
            return attachment.url;
        }
    }

    return getUserAvatarUrl(interaction);
}

export const DeepFryCommand = new Command({
    name: 'deepfry',
    description: 'deepfry image',
    shouldDeferReply: true,
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
            const imgUrl = getImageUrl(interaction);
            if (!imgUrl) throw new Error('No image found');

            const img = await Jimp.read(imgUrl as string);
            img.pixelate(1);
            img.contrast(1);
            img.brightness(0.2);

            const wrappedImage = new Base64JimpImage(img);
            await interaction.followUp(
                createFollowUp(interaction, wrappedImage),
            );
        } catch (err) {
            logger.fatal(err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'deep fried image'),
                ephemeral: true,
            });
        }
    },
});
