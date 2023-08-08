import InternalCommand from '../InternalCommand';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {ModalBuilder, TextInputBuilder, TextInputStyle} from 'discord.js';
import {
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from '@discordjs/builders';

export const ExperienceResetCommand = new InternalCommand({
    shouldDeferReply: false,
    run: async (interaction) => {
        if (!isAdmin(interaction)) {
            await interaction.followUp(
                trans('commands.experience.common.not_admin'),
            );
            return;
        }

        const user = interaction.options.getUser('user') ?? interaction.user;
        const modal = new ModalBuilder()
            .setCustomId(['XP_RESET', user.id].join('|'))
            .setTitle('Please confirm your action.');

        const nameInput = new TextInputBuilder()
            .setCustomId('name')
            .setPlaceholder('Name')
            .setRequired(true)
            .setLabel('Enter username for exp reset.')
            .setStyle(TextInputStyle.Short);

        const row =
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
                nameInput,
            );
        modal.addComponents(row);

        await interaction.showModal(modal);
    },
});
