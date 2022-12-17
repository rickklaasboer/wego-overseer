import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import Event from '../Event';

const logger = new Logger('wego-overseer:IAmDadEvent');

const DUTCH_PART = 'ik ben';
const ENGLISH_PART = 'i am';

/**
 * Get part of message after 'i am' or 'ik ben'
 */
function getPart(text: string, isDutch: boolean, isEnglish: boolean): string {
    const separator = isDutch ? DUTCH_PART : isEnglish ? ENGLISH_PART : '';
    return text.split(separator)[1].trim();
}

/**
 * Check if text includes either 'ik ben' or 'i am'
 */
function isValid(text: string): [boolean, boolean] {
    return [text.includes(DUTCH_PART), text.includes(ENGLISH_PART)];
}

/**
 * Determine locale, prefers Dutch
 */
function getLocale(isDutch: boolean, isEnglish: boolean): string {
    return isDutch ? 'nl' : isEnglish ? 'en' : '';
}

export const IAmDadEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const lower = message.content.toLowerCase();
            const [isDutch, isEnglish] = isValid(lower);

            if (!isDutch && !isEnglish) return;

            const part = getPart(lower, isDutch, isEnglish);
            const locale = getLocale(isDutch, isEnglish);
            await message.reply(
                trans({phrase: 'events.iamdadevent.msg', locale}, part),
            );
        } catch (err) {
            logger.fatal('Unable to handle IAmDadEvent', err);
        }
    },
});
