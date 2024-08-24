import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import GitubService from '@/app/services/GithubService';
import config from '@/config';
import Logger from '@wego/logger';
import {trans} from '@/util/localization/localization';
import {injectable} from 'tsyringe';

@injectable()
export default class VersionCommand implements BaseCommand {
    public name = 'version';
    public description = 'Get the current version of the bot';

    constructor(
        private githubService: GitubService,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const latest = await this.githubService.getLatestRelease();
            const behind = await this.githubService.getAmountOfReleasesBehind();

            await interaction.reply(
                trans(
                    'commands.version.message',
                    config.app.version,
                    process.version,
                    String(behind),
                    latest.name,
                ),
            );
        } catch (err) {
            this.logger.fatal('Failed to get version information', err);
        }
    }
}
