import {getEnvString} from './src/util/environment';
import 'dotenv/config';

const DB_CLIENT = getEnvString('DB_CLIENT', '');
const DB_HOST = getEnvString('DB_HOST', '');
const DB_USER = getEnvString('DB_USER', '');
const DB_PASSWORD = getEnvString('DB_PASSWORD', '');
const DB_DATABASE = getEnvString('DB_DATABASE', '');

export default {
    client: DB_CLIENT,
    connection: {
        host: DB_HOST,
        user: DB_USER,
        password: DB_PASSWORD,
        database: DB_DATABASE,
    },
    migrations: {
        tableName: 'migrations',
        directory: './src/database/migrations',
    },
    seeds: {
        directory: './src/database/seeds',
    },
};
