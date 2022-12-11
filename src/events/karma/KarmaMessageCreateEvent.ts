import {ensureChannelIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import Logger from '@/telemetry/logger';
import {Collection} from 'discord.js';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaMessageCreateEvent');

export const KarmaMessageCreateEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        const channel = await ensureChannelIsAvailable(
            message.channel.id,
            message.guild?.id,
        );
        if (!channel.isKarmaChannel) return;

        const emojis = message.guild?.emojis.cache.filter((e) => {
            return e.name === 'upvote' || e.name === 'downvote';
        });

        for (const [key] of emojis ?? new Collection()) {
            await message.react(key);
        }

        logger.debug('KarmaMessageCreateEvent received');
    },
});
