import BaseEvent from '@/app/events/BaseEvent';
import EnsureAuthorIsAvailable from '@/app/events/experience/middleware/EnsureAuthorIsAvailable';
import EnsureGuildIsAvailable from '@/app/events/experience/middleware/EnsureGuildIsAvailable';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import Logger from '@wego/logger';
import {randomInt} from 'crypto';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class ReceiveExperienceEvent
    implements BaseEvent<'messageCreate'>
{
    public name = 'ReceiveExperienceEvent';
    public event = 'messageCreate' as const;

    public middleware = [EnsureGuildIsAvailable, EnsureAuthorIsAvailable];

    constructor(
        private experienceRepository: ExperienceRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            if (message.author.bot) return;

            const hasCooldown = await this.experienceRepository.hasCooldown(
                message.guild?.id ?? '',
                message.author.id,
            );

            if (hasCooldown) return;

            await this.experienceRepository.addExperience(
                message.guild?.id ?? '',
                message.author.id,
                randomInt(5, 15),
            );
        } catch (err) {
            this.logger.fatal('Unable to run receive experience event', err);
        }
    }
}
