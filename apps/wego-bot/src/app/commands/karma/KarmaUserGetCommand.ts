import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import Logger from '@wego/logger';
import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';

@injectable()
export default class KarmaUserGetCommand extends BaseInternalCommand {
    constructor(
        private karmaRepository: KarmaRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const user =
                interaction.options.getUser('user') ?? interaction.user;

            const sum = await this.karmaRepository.getTotalKarma(
                interaction.guildId!,
                user.id,
            );

            await interaction.followUp(
                trans(
                    'commands.karma.user.get.result',
                    user.username,
                    String(sum.totalKarma ?? 0),
                ),
            );
        } catch (err) {
            this.logger.fatal('Failed to get karma for user', err);
        }
    }
}
