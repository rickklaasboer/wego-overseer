import type {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('swears', (table) => {
        table.string('id').primary();

        table.string('word').notNullable();
        table.string('userId').references('id').inTable('users').notNullable();
        table.integer('count').defaultTo(0);

        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('swears');
}

