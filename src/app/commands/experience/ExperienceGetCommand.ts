import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import EnsureUserIsAvailable from '@/app/middleware/commands/EnsureUserIsAvailable';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import ExperienceService from '@/app/services/ExperienceService';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization/localization';
import {toHumandReadableNumber} from '@/util/misc/misc';
import {capitalize} from '@/util/formatting/string';
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

    public middleware = [EnsureUserIsAvailable];

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
            const xpUntilNextLevel = this.experienceService.nextLevelXp(total);
            const leaderboardPosition = await this.getLeaderboardPosition(
                guildId,
                user.id,
            );

            const embed = this.createEmbed(
                user,
                level,
                total,
                leaderboardPosition,
                xpUntilNextLevel,
            );

            await interaction.followUp({embeds: [embed]});
        } catch (err) {
            this.logger.fatal('Unable to run experience get command', err);
        }
    }

    /**
     * Get leaderboard position of user
     */
    private async getLeaderboardPosition(guildId: string, userId: string) {
        return (
            await this.experienceRepository.getLeaderboard(guildId)
        ).findIndex((exp) => {
            return exp.user.id === userId;
        });
    }

    /**
     * Create embed
     */
    private createEmbed(
        user: User,
        level: number,
        totalExperience: number,
        leaderboardIndex: number,
        xpUntilNextLevel: number,
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
                        toHumandReadableNumber(level),
                        toHumandReadableNumber(totalExperience ?? 0),
                        toHumandReadableNumber(leaderboardIndex + 1),
                        toHumandReadableNumber(xpUntilNextLevel),
                    ),
                ),
            )
            .setThumbnail(user.displayAvatarURL());
    }
}
