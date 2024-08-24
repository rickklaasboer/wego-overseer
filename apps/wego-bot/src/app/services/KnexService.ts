import config from '@/config';
import Logger from '@wego/logger';
import knex, {Knex} from 'knex';
import {singleton} from 'tsyringe';

@singleton()
export default class KnexService {
    private knex: Knex;

    constructor(private logger: Logger) {
        this.knex = knex({
            debug: config.knex.enableLogger,
            client: config.database.client,
            connection: {
                host: config.database.host,
                user: config.database.user,
                password: config.database.password,
                database: config.database.database,
            },
            log: {
                debug: (...args) => this.logger.debug(...args),
                error: (...args) => this.logger.error(...args),
                warn: (...args) => this.logger.warn(...args),
                deprecate: (...args) => this.logger.warn(...args),
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
