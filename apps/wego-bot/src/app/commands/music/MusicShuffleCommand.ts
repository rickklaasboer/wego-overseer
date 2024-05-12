import {trans} from '@/util/localization/localization';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@wego/logger';

@injectable()
export default class MusicShuffleCommand extends BaseInternalCommand {
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

            if (!queue) {
                this.logger.info(
                    'Tried to shuffle queue, but queue did not exist',
                );
                await interaction.editReply(
                    trans('commands.music.shuffle.nothing_playing'),
                );
                return;
            }

            // Shuffle tracks in queue
            queue.tracks.shuffle();

            await interaction.editReply(
                trans('commands.music.shuffle.success'),
            );
        } catch (err) {
            this.logger.fatal('Failed to shuffle queue', err);
        }
    }
}
