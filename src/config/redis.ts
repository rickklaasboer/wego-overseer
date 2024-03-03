import {getEnvInt, getEnvString} from '@/util/misc/environment';

export default {
    host: getEnvString('REDIS_HOST', '127.0.0.1'),
    port: getEnvInt('REDIS_PORT', 6379),
};
