import {trans} from '@/util/localization/localization';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@wego/logger';

@injectable()
export default class MusicPauseCommand extends BaseInternalCommand {
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
                    'Tried to pause music, but nothing was playing',
                );
                await interaction.editReply(
                    trans('commands.music.pause.nothing_playing'),
                );
                return;
            }

            queue.node.pause();

            await interaction.editReply(trans('commands.music.pause.success'));
        } catch (err) {
            this.logger.fatal('Failed to pause music', err);
        }
    }
}
