import {BaseInteraction, CacheType, PermissionsBitField} from 'discord.js';

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
