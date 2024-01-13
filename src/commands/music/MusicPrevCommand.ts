import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicPrevCommand extends BaseInternalCommand {
    constructor(private playerService: DiscordPlayerService) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        if (!interaction.guild) return;

        const player = await this.playerService.getPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying()) {
            await interaction.editReply(
                trans('commands.music.prev.nothing_playing'),
            );
            return;
        }

        if (queue.history.isEmpty()) {
            await interaction.editReply(
                trans('commands.music.prev.no_previous_entry'),
            );
            return;
        }

        await queue.history.back();

        await interaction.editReply(trans('commands.music.prev.success'));
    }
}
