import {trans} from '@/util/localization';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';

@injectable()
export default class MusicNextCommand extends BaseInternalCommand {
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

        if (!queue) {
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
            await interaction.editReply(
                trans('commands.music.next.playlist_not_allowed'),
            );
            return;
        }

        queue.insertTrack(requested.tracks[0], 0);

        await interaction.editReply(
            trans('commands.music.next.success', requested.tracks[0].title),
        );
    }
}
