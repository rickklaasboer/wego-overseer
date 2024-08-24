import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import EnsureGuildIsAvailable from '@/app/middleware/commands/EnsureGuildIsAvailable';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import GuildRepository from '@/app/repositories/GuildRepository';
import Logger from '@wego/logger';
import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceSetAnnouncementChannel extends BaseInternalCommand {
    constructor(
        private guildRepository: GuildRepository,
        private logger: Logger,
    ) {
        super();
    }

    public middleware = [UserIsAdmin, EnsureGuildIsAvailable];

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const channel = interaction.options.getChannel('channel', true);
            const guild = await this.guildRepository.getById(
                interaction.guild?.id ?? '',
            );

            if (!guild || !channel) {
                await interaction.followUp(
                    trans('errors.common.command.unknown_error'),
                );
                return;
            }

            await this.guildRepository.update(guild?.id, {
                levelUpChannelId: channel.id,
            });

            await interaction.followUp(
                trans(
                    'commands.experience.set_announcement_channel.success',
                    channel.id,
                ),
            );
        } catch (err) {
            this.logger.fatal('Unable to run experience remove command', err);
        }
    }
}
