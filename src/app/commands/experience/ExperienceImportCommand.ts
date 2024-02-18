import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import UserIsAdmin from '@/app/middleware/commands/UserIsAdmin';
import ExperienceRepository from '@/app/repositories/ExperienceRepository';
import Logger from '@/telemetry/logger';
import {Mee6Leaderboard} from '@/types/mee6';
import Mee6LeaderboardValidator from '@/app/validators/Mee6LeaderboardValidator';
import {injectable} from 'tsyringe';
import UserRepository from '@/app/repositories/UserRepository';
import GuildUserRepository from '@/app/repositories/GuildUserRepository';
import {EmbedBuilder} from 'discord.js';
import {ErrorObject} from 'ajv';
import UserGuildLevelRepository from '@/app/repositories/UserGuildLevelRepository';
import ExperienceService from '@/app/services/ExperienceService';

@injectable()
export default class ExperienceImportCommand extends BaseInternalCommand {
    constructor(
        private experienceRepository: ExperienceRepository,
        private userRepository: UserRepository,
        private guildUserRepository: GuildUserRepository,
        private userGuildLevelRepository: UserGuildLevelRepository,
        private experienceService: ExperienceService,
        private mee6LeaderboardValidator: Mee6LeaderboardValidator,
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
            const file = interaction.options.getAttachment('file');

            if (!file?.contentType?.startsWith('application/json')) {
                interaction.followUp(
                    'Invalid file type. Please upload a JSON file.',
                );
                return;
            }

            const request = await fetch(file.url);
            const data = (await request.json()) as Mee6Leaderboard;

            const [isValid, errors] =
                this.mee6LeaderboardValidator.validate(data);

            if (!isValid && errors) {
                interaction.followUp({embeds: [this.createErrorEmbed(errors)]});
                return;
            }

            await interaction.followUp(
                'Importing experience, this may take a while...',
            );

            this.logger.info('Importing experience from Mee6 leaderboard...');

            for (const player of data.players) {
                const guildId = interaction.guildId ?? '';
                const user = await this.userRepository.getByIdOrCreate({
                    id: player.id,
                    username: player.username,
                    avatar: player.avatar,
                });
                const exists = await this.guildUserRepository.exists(
                    guildId,
                    user.id,
                );

                if (!exists) {
                    await this.guildUserRepository.create({
                        guildId,
                        userId: user.id,
                    });
                }
                await this.experienceRepository.addExperience(
                    guildId,
                    user.id,
                    player.xp,
                );

                const experience =
                    await this.experienceRepository.getExperience(
                        guildId,
                        user.id,
                    );
                const newLevel = this.experienceService.xpToLevel(
                    experience,
                    true,
                );

                await this.userGuildLevelRepository.setLevel(
                    guildId,
                    user.id,
                    newLevel,
                );

                this.logger.debug('Imported experience for user', {
                    user,
                    player,
                });
            }

            await interaction.editReply('Experience import complete! 🎉');
        } catch (err) {
            this.logger.fatal('Unable to run experience import command', err);
        }
    }

    /**
     * Create an error embed
     */
    private createErrorEmbed(errors: ErrorObject[]): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(
                'Invalid Mee6 leaderboard data, please fix the following issues:',
            )
            .setDescription(`\`\`\`${JSON.stringify(errors, null, 4)}\`\`\``)
            .setColor(0xff0000);
    }
}
