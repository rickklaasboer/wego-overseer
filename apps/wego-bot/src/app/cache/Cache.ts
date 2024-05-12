import Serializer from '@/app/cache/Serializer';
import RedisService from '@/app/services/RedisService';
import Logger from '@wego/logger';
import {singleton} from 'tsyringe';

type Keyable = string | number | (string | number)[];

@singleton()
export default class Cache {
    constructor(
        private redisService: RedisService,
        private serializer: Serializer,
        private logger: Logger,
    ) {}

    /**
     * Get a value from cache
     */
    public async get<T>(key: Keyable): Promise<T> {
        const redis = await this.redisService.getRedis();
        const response = await redis.get(this.parseKey(key));

        if (!response) {
            this.logger.debug(`Cache miss for key [${this.parseKey(key)}]`);
            throw new Error(`Cache miss for key [${this.parseKey(key)}]`);
        }

        return this.serializer.deserialize<T>(response);
    }

    /**
     * Check if a key exists in cache
     */
    public async has(key: Keyable): Promise<boolean> {
        const redis = await this.redisService.getRedis();
        const response = await redis.exists(this.parseKey(key));

        this.logger.debug(
            `Cache has key [${this.parseKey(key)}]: ${response === 1}`,
        );

        return response === 1;
    }

    /**
     * Set a value in cache
     */
    public async set<T>(key: Keyable, value: T, ttl = 600): Promise<void> {
        const redis = await this.redisService.getRedis();
        const serialized = this.serializer.serialize(value);

        this.logger.debug(
            `Setting cache key [${this.parseKey(key)}] with TTL ${ttl}`,
        );

        await redis.set(this.parseKey(key), serialized, {
            EX: ttl,
        });
    }

    /**
     * Delete a key from cache
     */
    public async forget(key: Keyable): Promise<void> {
        const redis = await this.redisService.getRedis();
        this.logger.debug(`Deleting cache key [${this.parseKey(key)}]`);
        await redis.del(this.parseKey(key));
    }

    /**
     * Get a value from cache, or set it if it doesn't exist
     */
    public async remember<T>(
        key: Keyable,
        ttl: number,
        callback: () => Promise<T>,
    ): Promise<T> {
        try {
            if (await this.has(key)) {
                this.logger.debug(
                    `Cache hit for key [${this.parseKey(key)}], returning value`,
                );
                return this.get<T>(key);
            }
        } catch {
            // We can safely assume that the cache miss is due to the key not existing
            // and continue with the callback
        }

        const result = await callback();

        if (result) {
            this.logger.debug(
                `Cache miss for key [${this.parseKey(key)}], setting value`,
            );
            await this.set<T>(key, result, ttl);
        }

        return result;
    }

    /**
     * Parse a key into a string
     */
    private parseKey(key: Keyable): string {
        if (typeof key === 'string' || typeof key === 'number') {
            return key.toString();
        }

        return key.join(':');
    }
}
