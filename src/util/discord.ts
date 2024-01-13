import {
    BaseInteraction,
    CacheType,
    Client,
    PermissionsBitField,
} from 'discord.js';

/**
 * Wrap string in discord code block
 */
export function wrapInCodeblock(str: string) {
    return '```' + str + '```';
}

/**
 * Determine if user has the Adminisatrator flag
 */
export function isAdmin(interaction: BaseInteraction<CacheType>): boolean {
    return (
        interaction.memberPermissions?.has(
            PermissionsBitField.Flags.Administrator,
        ) ?? false
    );
}

/**
 * Fetch user safely from discord
 */
export async function safeFetchUser(
    client: Client,
    userId: string,
): Promise<{username: string}> {
    try {
        return await client.users.fetch(userId);
    } catch (err) {
        return {username: userId};
    }
}
