import Command from '@/commands/Command';
import Channel from '@/entities/Channel';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';
import {t, translate} from '@/index';
import {isAdmin} from '@/util/discord';

export const KarmaChannelDisableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const {id, name = ''} = interaction.options.getChannel('channel') ?? {};

        if (!isAdmin(interaction)) {
            await interaction.reply(
                t('errors.common.command.no_permission', interaction.user.id),
            );
            return;
        }

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
