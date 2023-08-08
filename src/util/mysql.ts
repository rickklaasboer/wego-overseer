/**
 * Converts a Date object to a MySQL datetime string.
 */
export function toMysqlDateTime(date: Date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
