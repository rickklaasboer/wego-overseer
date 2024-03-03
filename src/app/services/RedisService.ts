import config from '@/config';
import {Maybe} from '@/types/util';
import Redis, {RedisClientType} from 'redis';
import {singleton} from 'tsyringe';

@singleton()
export default class RedisService {
    private redis: Maybe<RedisClientType> = null;

    /**
     * Get the Redis instance
     */
    public async getRedis(): Promise<RedisClientType> {
        if (!this.redis) {
            this.redis = Redis.createClient({
                socket: {
                    host: config.redis.host,
                    port: config.redis.port,
                },
            });
            await this.redis.connect();
        }

        return this.redis;
    }
}
