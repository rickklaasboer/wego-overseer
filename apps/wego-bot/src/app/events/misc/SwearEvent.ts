import BaseEvent from '@/app/events/BaseEvent';
import SwearRepository from '@/app/repositories/SwearRepository';
import BadWordsService from '@/app/services/text/BadWordsService';
import Logger from '@/telemetry/logger';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class SwearEvent implements BaseEvent<'messageCreate'> {
    public name = 'SwearEvent';
    public event = 'messageCreate' as const;

    constructor(
        private badWordsService: BadWordsService,
        private swearRepository: SwearRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            if (message.author.bot) return;

            const isProfane = this.badWordsService.containsBadWords(
                message.content,
            );

            if (!isProfane) return;

            // If the message contains bad words, get the exact words that are profane
            const profaneWords = this.badWordsService.getProfaneWords(
                message.content,
            );

            // Upsert the words to the database and increment the count
            for (const word of profaneWords) {
                this.logger.info(`SwearEvent: Profane word found: ${word}`);

                // If the word exists in the database for this user
                const swear = await this.swearRepository.getByWhere({
                    userId: message.author.id,
                    word,
                });

                if (swear) {
                    this.logger.info(
                        `SwearEvent: Swear exists for user: ${message.author.id}, word: ${word}`,
                    );
                    await this.swearRepository.update(swear.id, {
                        count: swear.count + 1,
                    });
                } else {
                    this.logger.info(
                        `SwearEvent: Swear does not exist for user: ${message.author.id}, word: ${word}`,
                    );
                    await this.swearRepository.create({
                        userId: message.author.id,
                        word,
                        count: 1,
                    });
                }
            }
        } catch (err) {
            this.logger.fatal('Failed to run SwearEvent', err);
        }
    }
}
