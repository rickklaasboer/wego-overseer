import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicNowCommand extends BaseInternalCommand {
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

        if (!queue || !queue.currentTrack) {
            await interaction.editReply(
                trans('commands.music.now.nothing_playing'),
            );
            return;
        }

        const requestedBy = queue.currentTrack.requestedBy;
        const embed = new EmbedBuilder()
            .setTitle(trans('commands.music.now.embed.title'))
            .setDescription(
                wrapInCodeblock(
                    queue.currentTrack.title +
                        '\n\n' +
                        queue.node.createProgressBar(),
                ),
            )
            .setFooter({
                text: trans(
                    'commands.music.now.embed.footer.text',
                    requestedBy?.username ?? '',
                ),
                iconURL: requestedBy?.displayAvatarURL(),
            });

        await interaction.editReply({embeds: [embed]});
    }
}
