import {trans} from '@/util/localization';
import {injectable} from 'tsyringe';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import EnsureGuildIsAvailable from '@/middleware/EnsureGuildIsAvailable';
import GuildRepository from '@/repositories/GuildRepository';
import UserIsAdmin from '@/middleware/UserIsAdmin';
import Logger from '@/telemetry/logger';

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
