import Logger from '@/telemetry/logger';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import InternalCommand from '../InternalCommand';
import {ensureGuildIsAvailable} from '../karma/KarmaCommand/predicates';

const logger = new Logger('wego-overseer:BirthdaySetChannelCommand');

export const BirthdaySetChannelCommand = new InternalCommand({
    run: async (interaction) => {
        try {
            const guild = await ensureGuildIsAvailable(interaction.guildId);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const channel = interaction.options.getChannel('channel')!;

            if (!isAdmin(interaction)) {
                await interaction.followUp(
                    trans('errors.common.command.no_permission'),
                );
                return;
            }

            await guild.$query().update({
                birthdayChannelId: channel.id,
            });

            interaction.followUp(
                trans('commands.birthday.setchannel.success', channel.id),
            );
        } catch (err) {
            logger.fatal('Unable to handle BirthdaySetChannelCommand', err);
            await interaction.followUp(
                trans('errors.common.command.unknown_error'),
            );
        }
    },
});
