import {getEnvString} from '@/util/misc/environment';

export default {
    client: getEnvString('DB_CLIENT', ''),
    host: getEnvString('DB_HOST', ''),
    user: getEnvString('DB_USER', ''),
    password: getEnvString('DB_PASSWORD', ''),
    database: getEnvString('DB_DATABASE', ''),
};
