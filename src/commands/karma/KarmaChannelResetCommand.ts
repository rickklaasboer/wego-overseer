import Command from '@/commands/Command';
import {translate} from '@/index';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';

export const KarmaChannelResetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const {id, name = ''} = interaction.options.getChannel('channel') ?? {};
        const channel = await ensureChannelIsAvailable(
            id,
            interaction.guild?.id,
        );

        if (!channel.isKarmaChannel) {
            await interaction.reply(
                translate('karka.channel.reset.not_a_karma_channel', name),
            );
        }

        // TODO: implement
    },
});
