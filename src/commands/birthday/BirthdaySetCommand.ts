import Logger from '@/telemetry/logger';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {pad} from '@/util/misc';
import dayjs from 'dayjs';
import InternalCommand from '../InternalCommand';
import {ensureUserIsAvailable} from '../karma/KarmaCommand/predicates';

const logger = new Logger('wego-overseer:BirthdaySetCommand');

export const BirthdaySetCommand = new InternalCommand({
    run: async (interaction) => {
        try {
            const requester = interaction.user;
            const target = interaction.options.getUser('user') ?? requester;

            const user = await ensureUserIsAvailable(target?.id);

            // If requester is not an admin, but tries to change someone else's birthday
            if (requester.id !== target?.id && !isAdmin(interaction)) {
                throw new Error(
                    "Requester tried to change target's birtday, but is not an administrator.",
                );
            }

            const [year, month, day] = [
                interaction.options.getNumber('date_year'),
                pad(interaction.options.getNumber('date_month')),
                pad(interaction.options.getNumber('date_day')),
            ];

            const date = dayjs(`${year}/${month}/${day}`);

            // Always allowed
            if (isAdmin(interaction) || requester.id === target?.id) {
                await user.$query().update({
                    dateOfBirth: date.format('YYYY-MM-DD'),
                });
            }

            await interaction.followUp(
                trans('commands.birthday.set.success', date.format('MM/DD')),
            );
        } catch (err) {
            logger.fatal('Unable to handle BirthdaySetCommand', err);
            await interaction.followUp(trans('commands.birthday.set.failure'));
        }
    },
});
