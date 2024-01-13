/**
 * Calls a closure with an object and returns the resulting object.
 *
 * NOTE: Exceptions thrown in the closure will not be caught.
 *
 * @param obj The object to pass to the closure.
 * @param cb The closure to call with the object.
 * @returns The object passed to the closure.
 */
export function tap<T>(obj: T, cb: (obj: T) => void): T {
    cb(obj);
    return obj;
}
