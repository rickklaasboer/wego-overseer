import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import UserIsAdmin from '@/middleware/UserIsAdmin';
import KarmaRepository from '@/repositories/KarmaRepository';
import {trans} from '@/util/localization';
import {
    ActionRowBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    User,
} from 'discord.js';
import {injectable} from 'tsyringe';

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

@injectable()
export default class KarmaUserResetCommand extends BaseInternalCommand {
    public shouldDeferReply = false;
    public middleware = [UserIsAdmin];

    constructor(private karmaRepository: KarmaRepository) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const user = interaction.options.getUser('user') ?? interaction.user;

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
                content: trans('commands.karma.user.reset.no_match'),
                ephemeral: true,
            });
            return;
        }

        const rowsAffected = await this.karmaRepository.resetKarma(
            interaction.guildId!,
            user.id,
        );

        await submitted.followUp({
            content: trans(
                'commands.karma.user.reset.success',
                rowsAffected.toFixed(),
                user.username,
            ),
            ephemeral: true,
        });
    }
}
