import {trans} from '@/util/localization';
import {GuildMember} from 'discord.js';
import {QueryType} from 'discord-player';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';

@injectable()
export default class MusicPlayCommand extends BaseInternalCommand {
    constructor(private playerService: DiscordPlayerService) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const player = await this.playerService.getPlayer();
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.editReply(
                trans('commands.music.play.not_in_voice'),
            );
            return;
        }

        if (!interaction.guild) return;

        const channel = member.voice.channel;

        const query = interaction.options.getString('query')!;
        const {searchResult, queue} = await player.play(channel, query, {
            nodeOptions: {
                leaveOnEnd: true,
                leaveOnStop: true,
                leaveOnEmpty: true,
                leaveOnEmptyCooldown: 300000,
                selfDeaf: false,
                metadata: {
                    channel: interaction.channel,
                },
            },
            fallbackSearchEngine: QueryType.YOUTUBE_SEARCH,
        });

        if (!queue.isPlaying()) {
            await queue.node.play();
        }

        if (searchResult.playlist) {
            await interaction.editReply(
                trans(
                    'commands.music.play.success.playlist',
                    searchResult.tracks.length.toString(),
                ),
            );

            return;
        }

        await interaction.editReply(
            trans(
                queue.tracks.size > 0
                    ? 'commands.music.play.success.track.queued'
                    : 'commands.music.play.success.track.playing',
                searchResult.tracks[0].title,
            ),
        );
    }
}
