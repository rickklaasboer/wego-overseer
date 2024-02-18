import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {toHumandReadableNumber} from '@/util/misc';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceSetCommand extends BaseInternalCommand {
    constructor(
        private experienceRepository: ExperienceRepository,
        private logger: Logger,
    ) {
        super();
    }

    public middleware = [UserIsAdmin];

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const guildId = interaction.guild?.id ?? '';
            const user =
                interaction.options.getUser('user') ?? interaction.user;
            const amount = interaction.options.getInteger('amount') ?? 0;

            await this.experienceRepository.setExperience(
                guildId,
                user.id,
                amount,
            );

            await interaction.followUp(
                trans(
                    'commands.experience.set.success',
                    user.username,
                    toHumandReadableNumber(amount),
                ),
            );
        } catch (err) {
            this.logger.fatal('Unable to run experience set command', err);
        }
    }
}
