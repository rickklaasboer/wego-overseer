import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('polls', (table) => {
        table.string('id').primary();
        table.string('title');
        table.string('description');
        table.string('allowMultipleVotes');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('polls');
}
