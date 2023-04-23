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

        await interaction.editReply(
            searchResult.playlist
                ? trans(
                      'commands.music.play.success.playlist',
                      String(searchResult.tracks.length),
                  )
                : trans(
                      'commands.music.play.success.single_track',
                      searchResult.tracks[0].title,
                  ),
        );
    },
});
