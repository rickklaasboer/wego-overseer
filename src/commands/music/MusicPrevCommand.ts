import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicPrevCommand extends BaseInternalCommand {
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
                this.logger.info('Tried to go back, but nothing was playing');
                await interaction.editReply(
                    trans('commands.music.prev.nothing_playing'),
                );
                return;
            }

            if (queue.history.isEmpty()) {
                this.logger.info('Tried to go back, but there was no history');
                await interaction.editReply(
                    trans('commands.music.prev.no_previous_entry'),
                );
                return;
            }

            await queue.history.back();

            await interaction.editReply(trans('commands.music.prev.success'));
        } catch (err) {
            this.logger.fatal('Failed to pause music', err);
        }
    }
}
