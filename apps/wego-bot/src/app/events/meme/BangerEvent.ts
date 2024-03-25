import BaseEvent from '@/app/events/BaseEvent';
import ComprehendService from '@/app/services/aws/ComprehendService';
import Logger from '@/telemetry/logger';
import {Maybe} from '@/types/util';
import {trans} from '@/util/localization/localization';
import {LanguageCode} from '@aws-sdk/client-comprehend';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class BangerEvent implements BaseEvent<'messageCreate'> {
    public name = 'BangerEvent';
    public event = 'messageCreate' as const;

    constructor(
        private comprehendService: ComprehendService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const word = this.getLastWordEndingWith(message.content, 'er');
            if (!word || word.length < 5) return;

            const dominance = await this.comprehendService.getLanguageDominance(
                message.content,
                LanguageCode.EN,
            );

            if (dominance < 0.75) {
                this.logger.debug(
                    `Ignored non-English message: ${message.content}, because dominance is ${dominance} which is below the threshold of 0.75`,
                );
                return;
            }

            await message.reply(trans('events.banger.msg', word));
        } catch (err) {
            this.logger.fatal('Failed to run BangerEvent', err);
        }
    }

    /**
     * Get the first word that ends with 'er'
     */
    private getLastWordEndingWith(input: string, word: string): Maybe<string> {
        // Split string into words
        const text = input
            .toLowerCase()
            .replace(/\b(\w)/g, (s) => s.toUpperCase());
        const words = text.split(' ');
        return words.find((w) => w.endsWith(word));
    }
}
