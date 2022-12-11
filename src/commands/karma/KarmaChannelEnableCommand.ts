import Command from '@/commands/Command';
import Channel from '@/entities/Channel';
import {translate} from '@/index';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';

export const KarmaChannelEnableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const {id, name = ''} = interaction.options.getChannel('channel') ?? {};
        const channel = await ensureChannelIsAvailable(
            id,
            interaction.guild?.id,
        );

        if (!channel.isKarmaChannel) {
            await Channel.query()
                .findById(channel.id)
                .patch({isKarmaChannel: true});
        }

        await interaction.reply(
            translate('karma.channel.enable.success', name),
        );
    },
});
