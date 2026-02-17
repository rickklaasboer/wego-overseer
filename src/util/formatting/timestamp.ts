import dayjs, {Dayjs} from 'dayjs';

/**
 * Creates a timestamp for the next occurance of the given date.
 *
 * @export
 * @param {Dayjs} date
 * @returns The timestamp (e.g. `<t:1630489200:R>`)
 */
export function createNextOccuranceTimestamp(date: Dayjs) {
    const now = dayjs();
    const birthday = dayjs(date).year(now.year());
    const year = birthday.isBefore(now) ? now.year() + 1 : now.year();
    const timestamp = String(birthday.year(year).unix());
    return `<t:${timestamp}:R>`;
}
