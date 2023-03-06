import Guild from '@/entities/Guild';
import User from '@/entities/User';
import {Knex} from 'knex';

/**
 * Check if binding already exists
 */
async function guildUserExists(
    db: Knex,
    userId: string,
    guildId: string,
): Promise<boolean> {
    return !!(await db
        .table('guilds_users')
        .where('userId', '=', userId)
        .andWhere('guildId', '=', guildId)
        .first());
}

/**
 * Bind user to guild if they're not already
 */
export async function bindUserToGuild(
    db: Knex,
    user: User,
    guild: Guild,
): Promise<void> {
    if (!(await guildUserExists(db, user.id, guild.id))) {
        // Connect user to guild
        await db.table('guilds_users').insert({
            userId: user.id,
            guildId: guild.id,
        });
    }
}
