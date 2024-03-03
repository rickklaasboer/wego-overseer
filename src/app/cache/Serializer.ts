import {injectable} from 'tsyringe';
import {serialize, deserialize} from 'v8';

@injectable()
export default class Serializer {
    /**
     * Serialize a value
     */
    public serialize<T>(value: T): string {
        return serialize(value).toString('base64');
    }

    /**
     * Deserialize a value
     */
    public deserialize<T>(value: string): T {
        const buffer = Buffer.from(value, 'base64');
        return deserialize(buffer) as T;
    }
}
