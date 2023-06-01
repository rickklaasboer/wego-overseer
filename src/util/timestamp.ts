import dayjs, {Dayjs} from 'dayjs';

export function createNextOccuranceTimestamp(date: Dayjs) {
    const now = dayjs();
    const birthday = dayjs(date).year(now.year());
    const year = birthday.isBefore(now) ? now.year() + 1 : now.year();
    const timestamp = String(birthday.year(year).unix());
    return `<t:${timestamp}:R>`;
}
