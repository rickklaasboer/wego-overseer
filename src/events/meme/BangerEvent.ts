import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:BangerEvent');

export const BangerEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    enabled: false,
    run: async (message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const {content} = message;

            // Split string into words
            const text = content
                .toLowerCase()
                .replace(/\b(\w)/g, (s) => s.toUpperCase());
            const words = text.split(' ');
            const word = words.find((word) => word.endsWith('er'));

            // Check if there is an actual word
            if (word != null) {
                if (word.length >= 5) {
                    const msg = `${word}? I hardly know her!`;
                    await message.reply(msg);
                }
            }
        } catch (err) {
            logger.fatal('Unable to handle BangerEvent', err);
        }
    },
});
