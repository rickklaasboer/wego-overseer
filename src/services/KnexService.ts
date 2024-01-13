import config from '@/config';
import knex, {Knex} from 'knex';
import {singleton} from 'tsyringe';

@singleton()
export default class KnexService {
    private knex: Knex;

    constructor() {
        this.knex = knex({
            client: config.database.client,
            connection: {
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database,
            },
        });
    }

    /**
     * Get the Knex instance
     */
    public getKnex(): Knex {
        return this.knex;
    }
}
