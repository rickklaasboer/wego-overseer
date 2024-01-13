import {trans} from '@/util/localization';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicShuffleCommand extends BaseInternalCommand {
    constructor(private playerService: DiscordPlayerService) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const guild = interaction.guild;

        if (!guild) return;

        const player = await this.playerService.getPlayer();
        const queue = player.nodes.get(interaction.guild.id);

        if (!queue) {
            await interaction.editReply(
                trans('commands.music.shuffle.nothing_playing'),
            );
            return;
        }

        // Shuffle tracks in queue
        queue.tracks.shuffle();

        await interaction.editReply(trans('commands.music.shuffle.success'));
    }
}
