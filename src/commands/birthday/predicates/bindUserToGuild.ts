import Guild from '@/entities/Guild';
import User from '@/entities/User';
import {Maybe} from '@/types/util';
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
    user: Maybe<User>,
    guild: Maybe<Guild>,
): Promise<void> {
    if (!user || !guild) {
        throw new Error('User or guild is not available');
    }

    if (!(await guildUserExists(db, user.id, guild.id))) {
        // Connect user to guild
        await db.table('guilds_users').insert({
            userId: user.id,
            guildId: guild.id,
        });
    }
}
