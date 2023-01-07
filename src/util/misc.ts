export function isEmpty<T>(iterable: Iterable<T>): boolean {
    return Array.from(iterable).length === 0;
}

/**
 * Transform seconds to minutes and seconds
 */
export function secondsToTime(input: number): [number, number] {
    const minutes = Math.floor(input / 60);
    const seconds = input - minutes * 60;

    return [minutes ?? 0, seconds ?? 0];
}
