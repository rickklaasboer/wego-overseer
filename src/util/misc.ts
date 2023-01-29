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
