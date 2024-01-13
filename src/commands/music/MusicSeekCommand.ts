import {trans} from '@/util/localization';
import {secondsToTime} from '@/util/misc';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicSeekCommand extends BaseInternalCommand {
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

        if (!queue || !queue.isPlaying()) {
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
    }
}
