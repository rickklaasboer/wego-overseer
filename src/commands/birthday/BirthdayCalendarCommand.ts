import {trans} from '@/util/localization';
import {ensureGuildIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import Logger from '@/telemetry/logger';
import {EmbedBuilder} from '@discordjs/builders';
import dayjs from 'dayjs';
import {createNextOccuranceTimestamp} from '@/util/timestamp';
import table from 'text-table';
import Guild from '@/entities/Guild';
import User from '@/entities/User';

const logger = new Logger('wego-overseer:commands:BirthdayCalendarCommand');

export const BirthdayCalendarCommand = new InternalCommand({
    run: async (interaction) => {
        try {
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            const birthdays = await guild
                .$query()
                .withGraphFetched({users: true})
                .modifyGraph('users', (q) => {
                    q.whereNotNull('dateOfBirth');
                });

            const embed = new EmbedBuilder().setTitle(
                trans(
                    'commands.birthday.calendar.embed.title',
                    interaction.guild?.name ?? '',
                ),
            );

            const birthdaysSorted = sortBirthdays(birthdays);
            const rows = await createBirthdayRows(birthdaysSorted);

            embed.setDescription(table(rows));

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            logger.fatal('Unable to handle BirthdayCalendarCommand', err);
            await interaction.followUp({
                content: trans(
                    'errors.common.failed',
                    'birthday calendar command',
                ),
                ephemeral: true,
            });
        }
    },
});

export function sortBirthdays(birthdays: Guild) {
    return birthdays.users.sort(({dateOfBirth: a}, {dateOfBirth: b}) => {
        const now = dayjs();
        const birthdayA = dayjs(a).year(now.year());
        const birthdayB = dayjs(b).year(now.year());

        if (birthdayA.isBefore(now) && birthdayB.isAfter(now)) return 1;
        if (birthdayA.isAfter(now) && birthdayB.isBefore(now)) return -1;
        if (birthdayA.isBefore(birthdayB)) return -1;
        if (birthdayA.isAfter(birthdayB)) return 1;

        return 0;
    });
}

export async function createBirthdayRows(birthdays: User[]) {
    return await Promise.all(
        birthdays.map(async ({id, dateOfBirth}) => {
            return [
                `${dayjs(dateOfBirth).format(
                    'DD/MM/YYYY',
                )} - <@${id}> (${createNextOccuranceTimestamp(
                    dayjs(dateOfBirth),
                )})`,
            ];
        }),
    );
}
