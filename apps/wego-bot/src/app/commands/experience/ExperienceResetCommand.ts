import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import EnsureUserIsAvailable from '@/app/middleware/commands/EnsureUserIsAvailable';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import Logger from '@/telemetry/logger';
import {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceResetommand extends BaseInternalCommand {
    constructor(private logger: Logger) {
        super();
    }

    public shouldDeferReply = false;
    public middleware = [UserIsAdmin, EnsureUserIsAvailable];

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const user =
                interaction.options.getUser('user') ?? interaction.user;
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
        } catch (err) {
            this.logger.fatal('Unable to run experience reset command', err);
        }
    }
}
