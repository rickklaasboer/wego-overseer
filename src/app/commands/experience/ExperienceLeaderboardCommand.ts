import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import Experience from '@/app/entities/Experience';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import ExperienceService from '@/app/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {wrapInCodeblock} from '@/util/misc/discord';
import {toHumandReadableNumber} from '@/util/misc/misc';
import {tableWithHead} from '@/util/formatting/table';
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
            const page = interaction.options.getInteger('page', false) ?? 1;
            const rows = await this.experienceRepository.getLeaderboard(
                interaction.guild?.id ?? '',
                page,
            );

            const table = await this.createTable(rows, page);
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
        page: number,
    ): Promise<string> {
        const rankWithOffset = page * 25 - 25;

        const table = tableWithHead(
            ['#', 'User', 'Level', 'Experience'],
            await Promise.all(
                rows.map(async ({totalExperience, user}, i) => {
                    const level = this.experienceService.xpToLevel(
                        totalExperience,
                        true,
                    );

                    return [
                        i + rankWithOffset + 1,
                        user.username,
                        toHumandReadableNumber(level),
                        toHumandReadableNumber(totalExperience),
                    ];
                }),
            ),
        );

        return wrapInCodeblock(table);
    }
}
