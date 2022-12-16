import Command from '@/commands/Command';
import Channel from '@/entities/Channel';
import {t, translate} from '@/index';
import {isAdmin} from '@/util/discord';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';

export const KarmaChannelEnableCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const {id, name = ''} = interaction.options.getChannel('channel') ?? {};

        if (!isAdmin(interaction)) {
            await interaction.reply({
                content: t(
                    'errors.common.command.no_permission',
                    interaction.user.id,
                ),
                ephemeral: true,
            });
            return;
        }

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
