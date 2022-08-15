export function tap<T>(obj: T, cb: (obj: T) => void): T {
    cb(obj);
    return obj;
}
