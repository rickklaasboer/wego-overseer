import {trans} from '@/util/localization/localization';
import {secondsToTime} from '@/util/misc/misc';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@wego/logger';

@injectable()
export default class MusicSeekCommand extends BaseInternalCommand {
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
                    'Tried to seek music, but nothing was playing or queue did not exist',
                );
                await interaction.editReply(
                    trans('commands.music.seek.nothing_playing'),
                );
                return;
            }

            const position = interaction.options.getNumber('seconds')!;
            await queue.node.seek(position);

            const [min, sec] = secondsToTime(position).map(String);

            await interaction.editReply(
                trans('commands.music.seek.success', min, sec),
            );
        } catch (err) {
            this.logger.fatal('Failed to seek music', err);
        }
    }
}
