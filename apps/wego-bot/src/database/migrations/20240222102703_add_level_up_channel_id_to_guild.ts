import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('guilds', (table) => {
        table.string('levelUpChannelId').nullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('guilds', (table) => {
        table.dropColumn('levelUpChannelId');
    });
}

