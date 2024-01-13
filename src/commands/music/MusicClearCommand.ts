import {trans} from '@/util/localization';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicClearCommand extends BaseInternalCommand {
    constructor(private playerService: DiscordPlayerService) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const player = await this.playerService.getPlayer();
        const guild = interaction.guild;

        if (!guild) return;

        const queue = player.nodes.get(guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(trans('commands.music.clear.no_music'));
            return;
        }

        if (queue.tracks.size < 1) {
            await interaction.editReply(
                trans('commands.music.clear.queue_empty'),
            );
            return;
        }

        queue.tracks.clear();

        await interaction.editReply(trans('commands.music.clear.success'));
    }
}
