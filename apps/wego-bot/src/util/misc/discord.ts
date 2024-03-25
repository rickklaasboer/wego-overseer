import {DefaultInteraction} from '@/app/commands/BaseCommand';
import {
    BaseInteraction,
    CacheType,
    Client,
    InteractionReplyOptions,
    InteractionResponse,
    Message,
    MessagePayload,
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
 * Wrap reply in a function
 */
export async function wrapReply(
    ctx: DefaultInteraction,
    content: string | MessagePayload | InteractionReplyOptions,
): Promise<Message<boolean> | InteractionResponse> {
    return ctx.replied
        ? await ctx.editReply(content)
        : ctx.deferred
          ? await ctx.followUp(content)
          : await ctx.reply(content);
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
        console.error(`Unable to fetch user with id ${userId}`, err);
        return {username: userId};
    }
}
