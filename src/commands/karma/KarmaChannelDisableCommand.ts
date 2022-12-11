import Command from '@/commands/Command';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';
import {i18n} from '@/index';
import Channel from '@/entities/Channel';

export const KarmaChannelDisableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const channel = await ensureChannelIsAvailable(interaction.channel?.id);
        const channelName = interaction.options.getChannel('channel')?.name;

        if (channel.isKarmaChannel) {
            await Channel.query()
                .findById(channel.id)
                .patch({isKarmaChannel: false});
        }

        await interaction.reply(
            i18n.__('karma.channel.disable.success', channelName ?? ''),
        );
    },
});
