import {randomUUID} from 'crypto';
import {Knex} from 'knex';

export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('karma', (table) => {
        table.string('id').primary().defaultTo(randomUUID());
        table.bigInteger('amount');
        table.string('messageId');
        table.string('guildId').references('id').inTable('guilds');
        table.string('userId').references('id').inTable('users');
        table.string('receivedFromUserId').references('id').inTable('users');
        table.string('channelId').references('id').inTable('channels');
        table.timestamps({useCamelCase: true});
    });
}

export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('karma');
}
