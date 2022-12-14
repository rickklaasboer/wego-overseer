import Command from '@/commands/Command';
import Karma from '@/entities/Karma';
import {trans} from '@/index';
import {
    ActionRowBuilder,
    ModalBuilder,
    PermissionsBitField,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

export const KarmaUserResetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const isAdmin = interaction.memberPermissions?.has(
            PermissionsBitField.Flags.Administrator,
        );

        if (isAdmin) {
            await interaction.reply(
                trans(
                    'errors.common.command.no_permission',
                    interaction.user.id,
                ),
            );
            return;
        }

        const fields = {
            username: new TextInputBuilder()
                .setCustomId('USERNAME_INPUT')
                .setLabel("Please type the user's name to confirm")
                .setStyle(TextInputStyle.Short),
        };

        const actionRowBuilder =
            new ActionRowBuilder<TextInputBuilder>().addComponents(
                fields.username,
            );

        const modalBuilder = new ModalBuilder()
            .setCustomId('RESET_CONFIRMATION_MODAL')
            .setTitle(`Reset ${user.username}'s karma?`);

        modalBuilder.addComponents(actionRowBuilder);

        await interaction.showModal(modalBuilder);

        const submitted = await interaction.awaitModalSubmit({
            time: 60000,
            filter: (i) => i.user.id === interaction.user.id,
        });

        if (submitted) {
            const username =
                submitted.fields.getTextInputValue('USERNAME_INPUT');

            if (username !== user.username) {
                await submitted.reply(
                    'Usernames did not match, please try again.',
                );
                return;
            }

            const rowsAffected = await Karma.query()
                .where('guildId', '=', interaction.guildId)
                .andWhere('userId', '=', user.id)
                .delete();

            await submitted.reply(
                `Done! Removed ${rowsAffected.toFixed()} karma entries of ${
                    user.username
                }. They now have 0 karma.`,
            );
        }
    },
});
