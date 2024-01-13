/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:events:CrazyEvent');

const REPLIES = new Map([
    ['crazy', 'Crazy? I was crazy once.'],
    ['they locked me in a room', 'A rubber room'],
    ['a rubber room with rats', 'And rats make me crazy!'],
]);

export const CrazyEvent = new Event({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const msg = message.content.toLowerCase();

            if (REPLIES.has(msg)) {
                await message.reply(REPLIES.get(msg)!);
            } else if (msg.includes('crazy')) {
                await message.reply(REPLIES.get('crazy')!);
            }
        } catch (err) {
            logger.fatal('Unable to handle CrazyEvent', err);
        }
    },
});
