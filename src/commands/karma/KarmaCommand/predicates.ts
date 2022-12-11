import Channel from '@/entities/Channel';
import Guild from '@/entities/Guild';
import User from '@/entities/User';
import {Maybe} from '@/types/util';

export async function ensureUserIsAvailable(
    userId: Maybe<string>,
): Promise<User> {
    if (!userId) {
        throw new Error('User id not specified');
    }

    const user = await User.query().findById(userId);
    if (user instanceof User) {
        return user;
    } else {
        return await User.query().insert({id: userId});
    }
}

export async function ensureGuildIsAvailable(
    guildId: Maybe<string>,
): Promise<Guild> {
    if (!guildId) {
        throw new Error('Guild id not specified');
    }

    const guild = await Guild.query().findById(guildId);
    if (guild instanceof Guild) {
        return guild;
    } else {
        return await Guild.query().insert({id: guildId});
    }
}

export async function ensureChannelIsAvailable(
    channelId: Maybe<string>,
): Promise<Channel> {
    if (!channelId) {
        throw new Error('Channel id not specified');
    }

    const channel = await Channel.query().findById(channelId);
    if (channel instanceof Channel) {
        return channel;
    } else {
        return await Channel.query().insert({id: channelId});
    }
}
