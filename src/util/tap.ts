/**
 * Calls a callback with an object and returns the object.
 *
 * @param obj The object to pass to the callback.
 * @param cb The callback to call with the object.
 * @returns The object passed to the callback.
 */
export function tap<T>(obj: T, cb: (obj: T) => void): T {
    cb(obj);
    return obj;
}
