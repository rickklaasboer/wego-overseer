import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('experience', (table) => {
        table.string('id').primary();
        table.bigInteger('amount');
        table.string('guildId').references('id').inTable('guilds');
        table.string('userId').references('id').inTable('users');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('experience');
}
