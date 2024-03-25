import config from '@/config';
import Logger from '@/telemetry/logger';
import knex, {Knex} from 'knex';
import {singleton} from 'tsyringe';

@singleton()
export default class KnexService {
    private knex: Knex;

    constructor(private logger: Logger) {
        this.knex = knex({
            client: config.database.client,
            connection: {
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database,
            },
        });

        if (config.knex.enableLogger) {
            this.knex.on('query', this.logger.debug);
        }
    }

    /**
     * Get the Knex instance
     */
    public getKnex(): Knex {
        return this.knex;
    }
}
