import {trans} from '@/util/localization';
import {GuildMember} from 'discord.js';
import Command from '../Command';
import {QueryType} from 'discord-player';

export const MusicPlayCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction, _, {player}) => {
        const member = interaction.member as GuildMember;

        if (!member.voice.channel) {
            await interaction.editReply(
                trans('commands.music.play.not_in_voice'),
            );
            return;
        }

        if (!interaction.guild) return;

        const channel = member.voice.channel;

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    },
});
