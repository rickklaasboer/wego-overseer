import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:events:YoloSwagEvent');

export const YoloSwagEvent = new Event({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            if (message.content.toLowerCase().includes('yolo')) {
                await message.reply('swag');
            }
        } catch (err) {
            logger.fatal('Unable to handle YoloSwagEvent', err);
        }
    },
});
