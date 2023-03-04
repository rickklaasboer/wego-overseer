import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.table('users', (table) => {
        table.date('dateOfBirth');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.table('users', (table) => {
        table.dropColumn('dateOfBirth');
    });
}
