import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import EnsureGuildIsAvailable from '@/app/middleware/commands/EnsureGuildIsAvailable';
import GuildRepository from '@/app/repositories/GuildRepository';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import Logger from '@wego/logger';

@injectable()
export default class BirthdaySetChannelCommand extends BaseInternalCommand {
    public middleware = [EnsureGuildIsAvailable, UserIsAdmin];

    constructor(
        private guildRepository: GuildRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const channel = interaction.options.getChannel('channel')!;

            await this.guildRepository.update(interaction.guildId!, {
                birthdayChannelId: channel.id,
            });

            interaction.followUp(
                trans('commands.birthday.setchannel.success', channel.id),
            );
        } catch (err) {
            this.logger.fatal('Failed to set birthday channel', err);
            await interaction.followUp(
                trans('errors.common.command.unknown_error'),
            );
        }
    }
}
