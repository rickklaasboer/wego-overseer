import Logger from '@/telemetry/logger';
import {randomNumber} from '@/util/karma';
import {trans} from '@/util/localization';
import Event from '../Event';

const logger = new Logger('wego-overseer:YoloSwag');

export const YoloSwag = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            if (message.content.toLowerCase().includes('yolo')) {
                    await message.reply('swag')
                }
        } catch (err) {
            logger.fatal('Unable to handle YoloSwag', err);
        }
    },
});