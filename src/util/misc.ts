export function isEmpty<T>(iterable: Iterable<T>): boolean {
    return Array.from(iterable).length === 0;
}
