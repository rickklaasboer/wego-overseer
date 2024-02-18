import BaseEvent from '@/app/events/BaseEvent';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {CacheType, Interaction} from 'discord.js';
import {injectable} from 'tsyringe';

export type ConfirmModalPayload = [string, string, string];

@injectable()
export default class ConfirmResetExperienceEvent
    implements BaseEvent<'interactionCreate'>
{
    public name = 'ConfirmResetExperienceEvent';
    public event = 'interactionCreate' as const;

    public middleware = [];

    constructor(
        private experienceRepository: ExperienceRepository,
        private clientService: DiscordClientService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(interaction: Interaction<CacheType>): Promise<void> {
        try {
            if (!interaction.isModalSubmit()) return;
            const client = this.clientService.getClient();

            const [eventType, userId] = interaction.customId.split(
                '|',
            ) as ConfirmModalPayload;

            // Terminate if not a xp reset
            if (!eventType.startsWith('XP_RESET')) return;

            const username = interaction.fields.getTextInputValue('name');
            const user = await client.users.fetch(userId);

            if (user.username !== username) {
                await interaction.reply(
                    trans('commands.experience.reset.username_mismatch'),
                );
                return;
            }

            await this.experienceRepository.resetExperience(
                interaction.guild?.id ?? '',
                userId,
            );

            await interaction.reply(
                trans('commands.experience.reset.success', username),
            );
        } catch (err) {
            this.logger.fatal(
                'Unable to run confirm reset experience event event',
                err,
            );
        }
    }
}
