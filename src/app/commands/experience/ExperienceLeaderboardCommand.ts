import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import Experience from '@/app/entities/Experience';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import ExperienceService from '@/app/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {EmbedBuilder} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceLeaderboardCommand extends BaseInternalCommand {
    constructor(
        private experienceRepository: ExperienceRepository,
        private experienceService: ExperienceService,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const rows = await this.experienceRepository.getLeaderboard(
                interaction.guild?.id ?? '',
            );

            const table = await this.createTable(rows);
            const embed = new EmbedBuilder()
                .setTitle(`${interaction.guild?.name}'s Leaderboard`)
                .setThumbnail(interaction.guild?.iconURL() ?? '')
                .setDescription(table);

            await interaction.followUp({embeds: [embed]});
        } catch (err) {
            this.logger.fatal(
                'Unable to run experience leaderboard command',
                err,
            );
        }
    }

    /**
     * Create the leaderboard table
     */
    private async createTable(
        rows: (Experience & {totalExperience: number})[],
    ): Promise<string> {
        const table = tableWithHead(
            ['#', 'User', 'Level', 'Experience'],
            await Promise.all(
                rows.map(async ({totalExperience, user}, i) => {
                    const level = this.experienceService.xpToLevel(
                        totalExperience,
                        true,
                    );

                    return [i + 1, user.username, level, totalExperience];
                }),
            ),
        );

        return wrapInCodeblock(table);
    }
}
