/**
 * Convert javascript date to mysql date format
 */
export function toMysqlDateTime(date: Date) {
    return date.toISOString().slice(0, 19).replace('T', ' ');
}
