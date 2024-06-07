import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('users', (table) => {
        table.string('id').primary();
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('users');
}
