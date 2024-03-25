import {trans} from '@/util/localization/localization';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import EnsureChannelIsAvailable from '@/app/middleware/commands/EnsureChannelIsAvailable';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import ChannelRepository from '@/app/repositories/ChannelRepository';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class KarmaChannelEnableCommand extends BaseInternalCommand {
    public middleware = [EnsureChannelIsAvailable, UserIsAdmin];

    constructor(
        private channelRepository: ChannelRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const discordChannel = interaction.options.getChannel('channel');
            const channel = await this.channelRepository.getById(
                discordChannel?.id ?? '',
            );

            if (!channel) {
                throw new Error('Channel not found');
            }

            if (!channel.isKarmaChannel) {
                await this.channelRepository.update(channel.id, {
                    isKarmaChannel: true,
                });
            }

            await interaction.followUp(
                trans(
                    'commands.karma.channel.enable.success',
                    discordChannel?.name ?? '',
                ),
            );
        } catch (err) {
            this.logger.fatal('Failed to enable karma channel', err);
        }
    }
}
