import Command from '@/commands/Command';
import Channel from '@/entities/Channel';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';

export const KarmaChannelEnableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const channel = await ensureChannelIsAvailable(interaction.channel?.id);
        const channelName = interaction.options.getChannel('channel')?.name;

        if (!channel.isKarmaChannel) {
            await Channel.query()
                .findById(channel.id)
                .patch({isKarmaChannel: true});
        }

        await interaction.reply(
            i18n.__('karma.channel.enable.success', channelName ?? ''),
        );
    },
});
