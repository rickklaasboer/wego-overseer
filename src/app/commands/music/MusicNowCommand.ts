import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import DiscordPlayerService from '@/app/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicNowCommand extends BaseInternalCommand {
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

            if (!queue || !queue.currentTrack) {
                this.logger.info(
                    'Tried to get current track, but nothing was playing',
                );
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
        } catch (err) {
            this.logger.fatal('Failed to get current track', err);
        }
    }
}
