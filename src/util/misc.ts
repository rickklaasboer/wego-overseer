import {Maybe} from '@/types/util';

/**
 * Transform seconds to minutes and seconds
 */
export function secondsToTime(input: number): [number, number] {
    const minutes = Math.floor(input / 60);
    const seconds = input - minutes * 60;

    return [minutes ?? 0, seconds ?? 0];
}

/**
 * Check if iterable is empty
 */
export function isEmpty<T>(iterable: Iterable<T>): boolean {
    return Array.from(iterable).length === 0;
}

/**
 * Check if string contains a (valid-ish) URL
 *
 * @see https://stackoverflow.com/a/10570421/10458808
 */
export function containsUrl(text: string): boolean {
    return new RegExp(
        '([a-zA-Z0-9]+://)?([a-zA-Z0-9_]+:[a-zA-Z0-9_]+@)?([a-zA-Z0-9.-]+\\.[A-Za-z]{2,4})(:[0-9]+)?(/.*)?',
    ).test(text);
}

/**
 * Wrapper around pad start
 */
export function pad(n: Maybe<number>, maxLength: number): string {
    if (!n) return '1'.padStart(maxLength, '0');

    const subject = String(n);

    if (subject.length < maxLength) {
        return subject.padStart(maxLength, '0');
    }

    return subject;
}

/**
 * Noop
 */
export function noop() {
    return null;
}

/**
 * Transform number to human readable number
 */
export function toHumandReadableNumber(num: number): string {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
}
