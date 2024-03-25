import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user_guild_level', (table) => {
        table.primary(['guildId', 'userId']);
        table.string('guildId').references('id').inTable('guilds');
        table.string('userId').references('id').inTable('users');
        table.bigInteger('level').defaultTo(0);
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('user_guild_level');
}
