import BaseEvent from '@/app/events/BaseEvent';
import EnsureAuthorIsAvailable from '@/app/events/experience/middleware/EnsureAuthorIsAvailable';
import EnsureGuildIsAvailable from '@/app/events/experience/middleware/EnsureGuildIsAvailable';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import GuildRepository from '@/app/repositories/GuildRepository';
import UserGuildLevelRepository from '@/app/repositories/UserGuildLevelRepository';
import ExperienceService from '@/app/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class LevelUpEvent implements BaseEvent<'messageCreate'> {
    public name = 'LevelUpEvent';
    public event = 'messageCreate' as const;

    public middleware = [EnsureGuildIsAvailable, EnsureAuthorIsAvailable];

    constructor(
        private guildRepository: GuildRepository,
        private experienceRepository: ExperienceRepository,
        private userGuildLevelRepository: UserGuildLevelRepository,
        private experienceService: ExperienceService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            if (message.author.bot) return;

            const level = await this.userGuildLevelRepository.getLevel(
                message.guild?.id ?? '',
                message.author.id,
            );
            const experience = await this.experienceRepository.getExperience(
                message.guild?.id ?? '',
                message.author.id,
            );

            const newLevel = this.experienceService.xpToLevel(experience, true);

            if (newLevel > level) {
                await this.userGuildLevelRepository.setLevel(
                    message.guild?.id ?? '',
                    message.author.id,
                    newLevel,
                );

                await this.sendLevelUpMessage(message, newLevel);
            }
        } catch (err) {
            this.logger.fatal('Unable to run level up event', err);
        }
    }

    /**
     * Send a level up message to the user
     */
    private async sendLevelUpMessage(
        message: Message<boolean>,
        newLevel: number,
    ) {
        const guild = await this.guildRepository.getById(
            message.guild?.id ?? '',
        );

        if (!guild?.levelUpChannelId) {
            this.logger.warn(
                `Tried to send level up message, but no channel set`,
            );
            return;
        }

        const channel = message.guild?.channels.cache.get(
            guild.levelUpChannelId,
        );

        if (!channel?.isTextBased()) {
            this.logger.warn(
                `Tried to send level up message, but channel is not text based`,
            );
            return;
        }

        await channel.send(
            trans('events.experience.level_up', message.author.id, newLevel),
        );
    }
}
