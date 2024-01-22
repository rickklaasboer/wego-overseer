import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicResumeCommand extends BaseInternalCommand {
    constructor(
        private playerService: DiscordPlayerService,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            if (!interaction.guild) return;

            const player = await this.playerService.getPlayer();
            const queue = player.nodes.get(interaction.guild.id);

            if (!queue || !queue.node.isPaused()) {
                this.logger.info(
                    'Tried to resume music, but nothing was paused or queue did not exist',
                );
                await interaction.editReply(
                    trans('commands.music.resume.invalid_queue'),
                );
                return;
            }

            queue.node.resume();

            await interaction.editReply(trans('commands.music.resume.success'));
        } catch (err) {
            this.logger.fatal('Failed to resume music', err);
        }
    }
}
