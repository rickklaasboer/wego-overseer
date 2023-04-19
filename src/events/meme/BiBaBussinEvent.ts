import Logger from '@/telemetry/logger';
import Event from '../Event';
import {randomNumber} from '@/util/karma';

const logger = new Logger('wego-overseer:BiBaBussinEvent');

const vowels = ['a', 'e', 'i', 'o', 'u'];

export const BiBaBussinEvent = new Event({
    name: 'messageCreate',
    enabled: false,
    run: async (_, message) => {
        try {
            if (message.author.bot) return;

            const parsed = message.content.toLowerCase();

            const results = parsed.split(' ').reduce((prev, current) => {
                if (current.endsWith('in') || current.endsWith('ing')) {
                    return [...prev, current];
                }
                return prev;
            }, [] as string[]);

            if (results.length) {
                const first = results[0].charAt(0);

                message.reply(
                    `${first}${vowels[randomNumber(0, 4)]} ${first}${
                        vowels[randomNumber(0, 4)]
                    } ${results[0]}!!!`,
                );
            }

            console.log({results});
        } catch (err) {
            logger.error('Unable to handle BiBaBussinEvent', err);
        }
    },
});
