import {trans} from '@/util/localization';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import EnsureChannelIsAvailable from '@/middleware/EnsureChannelIsAvailable';
import UserIsAdmin from '@/middleware/UserIsAdmin';
import ChannelRepository from '@/repositories/ChannelRepository';
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

            if (channel.isKarmaChannel) {
                await this.channelRepository.update(channel.id, {
                    isKarmaChannel: true,
                });
            }

            await interaction.followUp(
                trans(
                    'commands.karma.channel.disable.success',
                    discordChannel?.name ?? '',
                ),
            );
        } catch (err) {
            this.logger.fatal('Failed to enable karma channel', err);
        }
    }
}
