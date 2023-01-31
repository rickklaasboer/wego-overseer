import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {MusicPlayCommand} from '../MusicPlayCommand';
import {MusicPauseCommand} from '../MusicPauseCommand';
import {MusicResumeCommand} from '../MusicResumeCommand';
import {MusicSkipCommand} from '../MusicSkipCommand';
import {MusicPrevCommand} from '../MusicPrevCommand';
import {MusicNextCommand} from '../MusicNextCommand';
import {MusicQueueCommand} from '../MusicQueueCommand';
import {MusicStopCommand} from '../MusicStopCommand';
import {MusicNowCommand} from '../MusicNowCommand';
import {MusicClearCommand} from '../MusicClearCommand';
import {MusicSeekCommand} from '../MusicSeekCommand';
import {trans} from '@/util/localization';

const FORWARDABLE_COMMANDS: Record<string, Command> = {
    play: MusicPlayCommand,
    pause: MusicPauseCommand,
    resume: MusicResumeCommand,
    skip: MusicSkipCommand,
    prev: MusicPrevCommand,
    next: MusicNextCommand,
    stop: MusicStopCommand,
    queue: MusicQueueCommand,
    now: MusicNowCommand,
    clear: MusicClearCommand,
    seek: MusicSeekCommand,
};

export const MusicCommand = new Command({
    name: 'music',
    description: "Wego overseer's music player",
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'play',
            description: 'Play a song',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.STRING,
                    name: 'query',
                    description: 'Song name or URL',
                    min_length: 1,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'pause',
            description: 'Pause the currently playing song',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'resume',
            description: 'Resume the current queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'skip',
            description: 'Go to the next song in queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'prev',
            description: 'Go to the previous song in queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'next',
            description: 'Adds a song to the start of queue',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.STRING,
                    name: 'query',
                    description: 'Song name or URL',
                    min_length: 1,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'stop',
            description: 'Stops playback and clears current queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'queue',
            description: 'Display the current queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'now',
            description: 'Display the currently playing song',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'clear',
            description: 'Clear the queue',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'seek',
            description: 'Seek to position in currently playing song',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'seconds',
                    description: 'Position to seek to in seconds',
                    min_value: 1,
                },
            ],
        },
    ],
    run: async (interaction, self, ctx) => {
        try {
            await interaction.deferReply();

            const cmd = interaction.options.getSubcommand();

            // Kinda ugly but it works, I guess.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const forwardable = FORWARDABLE_COMMANDS[cmd];
            await self.forwardTo(forwardable, interaction, ctx);
        } catch (err) {
            if (!interaction.replied) {
                const queue = ctx.player.getQueue(interaction.guildId ?? '');
                if (queue) queue.destroy(true);

                await interaction.editReply(
                    trans('errors.common.command.unknown_error'),
                );
            }
            console.error(err);
        }
    },
});
