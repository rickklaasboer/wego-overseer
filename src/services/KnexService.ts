import {getEnvString} from '@/util/environment';
import {injectable} from 'inversify';
import knex, {Knex} from 'knex';
import {Model} from 'objection';

const DB_CLIENT = getEnvString('DB_CLIENT', '');
const DB_HOST = getEnvString('DB_HOST', '');
const DB_USER = getEnvString('DB_USER', '');
const DB_PASSWORD = getEnvString('DB_PASSWORD', '');
const DB_DATABASE = getEnvString('DB_DATABASE', '');

@injectable()
export default class KnexService {
    private knex: Knex;

    constructor() {
        this.knex = knex({
            client: DB_CLIENT,
            connection: {
                host: DB_HOST,
                user: DB_USER,
                password: DB_PASSWORD,
                database: DB_DATABASE,
            },
            migrations: {
                tableName: 'migrations',
                directory: '../database/migrations',
            },
            seeds: {
                directory: '../database/seeds',
            },
        });

        Model.knex(this.knex);
    }

    /**
     * Get the Knex instance.
     */
    public getKnex(): Knex {
        return this.knex;
    }
}
