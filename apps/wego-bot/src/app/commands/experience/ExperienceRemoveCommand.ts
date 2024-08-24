import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import EnsureUserIsAvailable from '@/app/middleware/commands/EnsureUserIsAvailable';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import Logger from '@wego/logger';
import {trans} from '@/util/localization/localization';
import {toHumandReadableNumber} from '@/util/misc/misc';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceRemoveCommand extends BaseInternalCommand {
    constructor(
        private experienceRepository: ExperienceRepository,
        private logger: Logger,
    ) {
        super();
    }

    public middleware = [UserIsAdmin, EnsureUserIsAvailable];

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const guildId = interaction.guild?.id ?? '';
            const user =
                interaction.options.getUser('user') ?? interaction.user;
            const amount = interaction.options.getInteger('amount') ?? 0;

            await this.experienceRepository.removeExperience(
                guildId,
                user.id,
                amount,
            );
            const newExperience = await this.experienceRepository.getExperience(
                guildId,
                user.id,
            );

            await interaction.followUp(
                trans(
                    'commands.experience.remove.success',
                    toHumandReadableNumber(amount),
                    user.username,
                    toHumandReadableNumber(newExperience),
                ),
            );
        } catch (err) {
            this.logger.fatal('Unable to run experience remove command', err);
        }
    }
}
