import {trans} from '@/util/localization/localization';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicNextCommand extends BaseInternalCommand {
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

            if (!queue) {
                this.logger.info(
                    'Tried to add next song, but there was no queue',
                );
                await interaction.editReply(
                    trans('commands.music.next.queue_empty'),
                );
                return;
            }

            const query = interaction.options.getString('query')!;
            const requested = await player.search(query, {
                requestedBy: interaction.user,
            });

            if (!requested || requested.playlist) {
                this.logger.info(
                    'Tried adding playlist to next position in queue, but it was not allowed',
                );
                await interaction.editReply(
                    trans('commands.music.next.playlist_not_allowed'),
                );
                return;
            }

            queue.insertTrack(requested.tracks[0], 0);

            await interaction.editReply(
                trans('commands.music.next.success', requested.tracks[0].title),
            );
        } catch (err) {
            this.logger.fatal('Failed to add next song to queue', err);
        }
    }
}
