import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import ExperienceService from '@/app/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {capitalize} from '@/util/string';
import {EmbedBuilder, User} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceGetCommand extends BaseInternalCommand {
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
            const user =
                interaction.options.getUser('user') ?? interaction.user;
            const guildId = interaction.guild?.id ?? '';

            const total = await this.experienceRepository.getExperience(
                guildId,
                user.id,
            );
            const level = this.experienceService.xpToLevel(total, true);

            const leaderboardIndex = (
                await this.experienceRepository.getLeaderboard(guildId)
            ).findIndex((exp) => {
                return exp.user.id === user.id;
            });

            const embed = this.createEmbed(
                user,
                level,
                total,
                leaderboardIndex,
            );

            await interaction.followUp({embeds: [embed]});
        } catch (err) {
            this.logger.fatal('Unable to run experience get command', err);
        }
    }

    /**
     * Create embed
     */
    private createEmbed(
        user: User,
        level: number,
        totalExperience: number,
        leaderboardIndex: number,
    ): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(
                capitalize(
                    trans('commands.experience.get.embed.title', user.username),
                ),
            )
            .setDescription(
                capitalize(
                    trans(
                        'commands.experience.get.embed.description',
                        user.username,
                        level,
                        totalExperience ?? 0,
                        leaderboardIndex + 1,
                    ),
                ),
            )
            .setThumbnail(user.displayAvatarURL());
    }
}
