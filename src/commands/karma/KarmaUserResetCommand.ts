import Command from '@/commands/Command';
import Karma from '@/entities/Karma';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    User,
} from 'discord.js';

/**
 * Create modal
 */
function createModal(user: User): ModalBuilder {
    const fields = {
        username: new TextInputBuilder()
            .setCustomId('USERNAME_INPUT')
            .setLabel("Please type the user's name to confirm")
            .setStyle(TextInputStyle.Short),
    };

    const actionRowBuilder =
        new ActionRowBuilder<TextInputBuilder>().addComponents(fields.username);

    const modalBuilder = new ModalBuilder()
        .setCustomId('RESET_CONFIRMATION_MODAL')
        .setTitle(`Reset ${user.username}'s karma?`);

    modalBuilder.addComponents(actionRowBuilder);

    return modalBuilder;
}

export const KarmaUserResetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        if (!isAdmin(interaction)) {
            await interaction.reply({
                content: trans(
                    'errors.common.command.no_permission',
                    interaction.user.id,
                ),
                ephemeral: true,
            });
            return;
        }

        const modal = createModal(user);
        await interaction.showModal(modal);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
        });

        if (!submitted) return;

        const username = submitted.fields.getTextInputValue('USERNAME_INPUT');

        if (username !== user.username) {
            await submitted.reply({
                content: 'Usernames did not match, please try again.',
                ephemeral: true,
            });
            return;
        }

        const rowsAffected = await Karma.query()
            .where('guildId', '=', interaction.guildId)
            .andWhere('userId', '=', user.id)
            .delete();

        await submitted.reply({
            content: `Done! Removed ${rowsAffected.toFixed()} karma entries of ${
                user.username
            }. They now have 0 karma.`,
            ephemeral: true,
        });
    },
});
