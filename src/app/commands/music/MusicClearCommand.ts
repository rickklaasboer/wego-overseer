import {trans} from '@/util/localization';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicClearCommand extends BaseInternalCommand {
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
            const player = await this.playerService.getPlayer();
            const guild = interaction.guild;

            if (!guild) return;

            const queue = player.nodes.get(guild.id);

            if (!queue || !queue.isPlaying()) {
                this.logger.info(
                    'Tried to clear queue, but nothing was playing',
                );
                await interaction.editReply(
                    trans('commands.music.clear.no_music'),
                );
                return;
            }

            if (queue.tracks.size < 1) {
                this.logger.info('Tried to clear queue, but it was empty');
                await interaction.editReply(
                    trans('commands.music.clear.queue_empty'),
                );
                return;
            }

            queue.tracks.clear();

            await interaction.editReply(trans('commands.music.clear.success'));
        } catch (err) {
            this.logger.fatal('Failed to clear queue', err);
        }
    }
}
