import 'dotenv/config';

const {DB_CLIENT, DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE} = process.env;

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
