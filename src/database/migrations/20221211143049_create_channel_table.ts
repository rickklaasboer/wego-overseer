import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('channels', (table) => {
        table.string('id').primary();
        table.boolean('isKarmaChannel').defaultTo(false);
        table.string('guildId').references('id').inTable('guilds');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('channels');
}
