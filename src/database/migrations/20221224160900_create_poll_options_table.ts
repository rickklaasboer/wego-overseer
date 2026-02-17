import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('poll_options', (table) => {
        table.string('id').primary();
        table.string('name');
        table.string('pollId').references('id').inTable('polls');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('poll_options');
}
