import {trans} from '@/util/localization/localization';
import BaseEvent from '@/app/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';
import ComprehendService from '@/app/services/aws/ComprehendService';
import {DetectDominantLanguageCommand} from '@aws-sdk/client-comprehend';
import {Maybe} from '@/types/util';

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

            const word = this.getWord(message.content);
            if (!word || word.length < 5) return;

            const dominance = await this.getEnglishDominance(message.content);
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
    private getWord(input: string): Maybe<string> {
        // Split string into words
        const text = input
            .toLowerCase()
            .replace(/\b(\w)/g, (s) => s.toUpperCase());
        const words = text.split(' ');
        return words.find((word) => word.endsWith('er'));
    }

    /**
     * Get the dominance of English in input
     */
    private async getEnglishDominance(input: string): Promise<number> {
        const client = this.comprehendService.getComprehendClient();
        const {Languages} = await client.send(
            new DetectDominantLanguageCommand({Text: input}),
        );

        return (
            Languages?.find(({LanguageCode}) => LanguageCode === 'en')?.Score ??
            0
        );
    }
}
