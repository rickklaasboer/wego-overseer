import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('poll_votes', (table) => {
        table.string('id').primary();
        table.string('pollOptionId').references('id').inTable('poll_options');
        table.string('userId').references('id').inTable('users');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('poll_votes');
}
