import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicSkipCommand extends BaseInternalCommand {
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

            if (!queue || !queue.isPlaying()) {
                this.logger.info(
                    'Tried to skip music, but nothing was playing or queue did not exist',
                );
                await interaction.editReply(
                    trans('commands.music.skip.nothing_playing'),
                );
                return;
            }

            const prev = queue.currentTrack?.title;

            queue.node.skip();

            if (!prev) return;

            await interaction.editReply(
                trans('commands.music.skip.success', prev),
            );
        } catch (err) {
            this.logger.fatal('Failed to skip music', err);
        }
    }
}
