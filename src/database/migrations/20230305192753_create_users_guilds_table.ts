import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('guilds_users', (table) => {
        table.primary(['guildId', 'userId']);
        table.string('guildId').references('id').inTable('guilds');
        table.string('userId').references('id').inTable('users');
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('guilds_users');
}
