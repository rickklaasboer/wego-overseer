import User from '@/entities/User';
import Event from './Event';

export const MessageCreateEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        if (message.author.bot) return;

        // TODO: make
    },
});
