import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicStopCommand extends BaseInternalCommand {
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
            const guild = interaction.guild;

            if (!guild) return;

            const player = await this.playerService.getPlayer();
            const queue = player.nodes.get(interaction.guild.id);

            if (!queue || !queue.isPlaying()) {
                this.logger.info(
                    'Tried to stop music, but nothing was playing or queue did not exist',
                );
                await interaction.editReply(
                    trans('commands.music.stop.nothing_playing'),
                );
                return;
            }

            queue.delete();
            await interaction.editReply(trans('commands.music.stop.success'));
        } catch (err) {
            this.logger.fatal('Failed to stop music', err);
        }
    }
}
