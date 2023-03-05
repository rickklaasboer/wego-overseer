import Logger from '@/telemetry/logger';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {pad} from '@/util/misc';
import dayjs from 'dayjs';
import {Knex} from 'knex';
import InternalCommand from '../InternalCommand';
import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '../karma/KarmaCommand/predicates';

const logger = new Logger('wego-overseer:BirthdaySetCommand');

async function guildUserExists(
    db: Knex,
    userId: string,
    guildId: string,
): Promise<boolean> {
    return !!db
        .table('guilds_users')
        .where('userId', '=', userId)
        .andWhere('guildId', '=', guildId)
        .first();
}

export const BirthdaySetCommand = new InternalCommand({
    run: async (interaction, _, {db}) => {
        try {
            const requester = interaction.user;
            const target = interaction.options.getUser('user') ?? requester;

            const user = await ensureUserIsAvailable(target?.id);
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            if (!(await guildUserExists(db, user.id, guild.id))) {
                // Connect user to guild
                await db.table('guilds_users').insert({
                    userId: user.id,
                    guildId: guild.id,
                });
            }

            // If requester is not an admin, but tries to change someone else's birthday
            if (requester.id !== target?.id && !isAdmin(interaction)) {
                throw new Error(
                    "Requester tried to change target's birtday, but is not an administrator.",
                );
            }

            const birthDate = [
                interaction.options.getNumber('date_year'),
                pad(interaction.options.getNumber('date_month'), 2),
                pad(interaction.options.getNumber('date_day'), 2),
            ];

            const date = dayjs(birthDate.join('/'));

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
