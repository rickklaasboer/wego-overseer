import {trans} from '@/util/localization';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import EnsureChannelIsAvailable from '@/middleware/EnsureChannelIsAvailable';
import UserIsAdmin from '@/middleware/UserIsAdmin';
import ChannelRepository from '@/repositories/ChannelRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class KarmaChannelDisableCommand extends BaseInternalCommand {
    public middleware = [EnsureChannelIsAvailable, UserIsAdmin];

    constructor(private channelRepository: ChannelRepository) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const discordChannel = interaction.options.getChannel('channel');
        const channel = await this.channelRepository.getById(
            discordChannel?.id ?? '',
        );

        if (!channel) {
            throw new Error('Channel not found');
        }

        if (channel.isKarmaChannel) {
            await this.channelRepository.update(channel.id, {
                isKarmaChannel: false,
            });
        }

        await interaction.reply(
            trans(
                'commands.karma.channel.disable.success',
                discordChannel?.name ?? '',
            ),
        );
    }
}
