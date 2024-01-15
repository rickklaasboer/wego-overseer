import {randomNumber} from '@/util/karma';
import {trans} from '@/util/localization';
import BaseEvent from '@/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class IAmDadEvent implements BaseEvent<'messageCreate'> {
    public name = 'IAmDadEvent';
    public event = 'messageCreate' as const;
    private possibleParts = {
        nl: 'ik ben',
        en: 'i am',
    };

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const lower = message.content.toLowerCase();
            const [isDutch, isEnglish] = this.isValid(lower);

            if (!isDutch && !isEnglish) return;

            const part = this.getPart(lower, isDutch, isEnglish);
            const locale = this.getLocale(isDutch, isEnglish);

            // Super 100% random chance if the event should fire or not
            // this is to prevent spam
            const shouldFire = randomNumber(1, 10) === 7;

            if (!shouldFire) return;

            await message.reply(
                trans({phrase: 'events.iamdadevent.msg', locale}, part),
            );
        } catch (err) {
            console.error('Unable to handle IAmDadEvent', err);
        }
    }

    /**
     * Get part of message after 'i am' or 'ik ben'
     */
    private getPart(
        text: string,
        isDutch: boolean,
        isEnglish: boolean,
    ): string {
        const separator = isDutch
            ? this.possibleParts.nl
            : isEnglish
            ? this.possibleParts.en
            : '';

        return text.split(separator)[1].trim();
    }

    /**
     * Check if text includes either 'ik ben' or 'i am'
     */
    private isValid(text: string): [boolean, boolean] {
        return [
            text.includes(this.possibleParts.nl),
            text.includes(this.possibleParts.en),
        ];
    }

    /**
     * Determine locale, prefers Dutch
     */
    private getLocale(isDutch: boolean, isEnglish: boolean): string {
        return isDutch ? 'nl' : isEnglish ? 'en' : '';
    }
}
