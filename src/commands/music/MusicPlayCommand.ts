import {trans} from '@/util/localization';
import {GuildMember} from 'discord.js';
import Command from '../Command';

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

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const query = interaction.options.getString('query')!;
        const queue = player.createQueue(interaction.guild, {
            leaveOnEnd: true,
            leaveOnStop: true,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 300000,
            autoSelfDeaf: false,
            spotifyBridge: true,
            ytdlOptions: {
                filter: 'audioonly',
                quality: 'highestaudio',
                highWaterMark: 1 << 30,
            },
            metadata: {
                channel: interaction.channel,
            },
        });

        if (!queue.connection) {
            await queue.connect(member.voice.channel);
        }

        const requested = await player.search(query, {
            requestedBy: interaction.user,
        });

        if (!requested) {
            queue.destroy();
            await interaction.editReply(
                trans('commands.music.play.song_not_found'),
            );
            return;
        }

        if (requested.playlist) {
            queue.addTracks(requested.tracks);
        } else {
            queue.addTrack(requested.tracks[0]);
        }

        if (!queue.playing) {
            await queue.play();
        }

        await interaction.editReply(
            requested.playlist
                ? trans(
                      'commands.music.play.success.playlist',
                      String(requested.tracks.length),
                  )
                : trans(
                      'commands.music.play.success.single_track',
                      requested.tracks[0].title,
                  ),
        );
    },
});