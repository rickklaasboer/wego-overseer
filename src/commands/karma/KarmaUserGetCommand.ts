import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import KarmaRepository from '@/repositories/KarmaRepository';
import {trans} from '@/util/localization';
import {injectable} from 'tsyringe';

@injectable()
export default class KarmaUserGetCommand extends BaseInternalCommand {
    constructor(private karmaRepository: KarmaRepository) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const sum = await this.karmaRepository.getKarma(
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
    }
}
