import Logger from '@/telemetry/logger';
import {randomNumber} from '@/util/karma';
import {trans} from '@/util/localization';
import Event from '../Event';

const logger = new Logger('wego-overseer:BangerEvent');

export const BangerEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            // Split string into words
            const text = message.content
                .toLowerCase()
                .replace(/\b(\w)/g, (s) => s.toUpperCase());
            const words = text.split(' ');
            const word = words.find((word) => word.endsWith('er'));

            // Super 100% random chance if the event should fire or not
            // this is to prevent spam
            const shouldFire = randomNumber(1, 10) === 7;

            if (shouldFire && word && word.length >= 5) {
                await message.reply(trans('events.banger.msg', word));
            }
        } catch (err) {
            logger.fatal('Unable to handle BangerEvent', err);
        }
    },
});
