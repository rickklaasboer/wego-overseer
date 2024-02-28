import Guild from '@/app/entities/Guild';
import User from '@/app/entities/User';
import {createNextOccuranceTimestamp} from '@/util/formatting/timestamp';
import dayjs from 'dayjs';

/**
 * Sort users by birthday
 */
export function sortUsersByBirthday(guild: Guild) {
    return guild.users.sort(({dateOfBirth: a}, {dateOfBirth: b}) => {
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

/**
 * Create birthday rows for table
 */
export async function createBirthdayRows(guild: User[]) {
    return guild.map(({id, dateOfBirth}) => [
        `${dayjs(dateOfBirth).format(
            'DD/MM/YYYY',
        )} - <@${id}> (${createNextOccuranceTimestamp(dayjs(dateOfBirth))})`,
    ]);
}
