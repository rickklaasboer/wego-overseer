import Command from '@/commands/Command';
import Channel from '@/entities/Channel';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';
import {translate} from '@/index';

export const KarmaChannelDisableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const {id, name = ''} = interaction.options.getChannel('channel') ?? {};
        const channel = await ensureChannelIsAvailable(
            id,
            interaction.guild?.id,
        );

        if (channel.isKarmaChannel) {
            await Channel.query()
                .findById(channel.id)
                .patch({isKarmaChannel: false});
        }

        await interaction.reply(
            translate('karma.channel.disable.success', name),
        );
    },
});
