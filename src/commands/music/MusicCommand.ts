import {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {MusicPlayCommand} from '@/commands/music/MusicPlayCommand';
import {MusicPauseCommand} from '@/commands/music/MusicPauseCommand';
import {MusicResumeCommand} from '@/commands/music/MusicResumeCommand';
import {MusicSkipCommand} from '@/commands/music/MusicSkipCommand';
import {MusicPrevCommand} from '@/commands/music/MusicPrevCommand';
import {MusicNextCommand} from '@/commands/music/MusicNextCommand';
import {MusicQueueCommand} from '@/commands/music/MusicQueueCommand';
import {MusicStopCommand} from '@/commands/music/MusicStopCommand';
import {MusicNowCommand} from '@/commands/music/MusicNowCommand';
import {MusicClearCommand} from '@/commands/music/MusicClearCommand';
import {MusicSeekCommand} from '@/commands/music/MusicSeekCommand';
import EntryPointCommand from '@/commands/EntryPointCommand';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:MusicCommand');

export const MusicCommand = new EntryPointCommand({
    name: 'music',
    description: "Wego overseer's music player",
    forwardables: new Map([
        ['play', MusicPlayCommand],
        ['pause', MusicPauseCommand],
        ['resume', MusicResumeCommand],
        ['skip', MusicSkipCommand],
        ['prev', MusicPrevCommand],
        ['next', MusicNextCommand],
        ['stop', MusicStopCommand],
        ['queue', MusicQueueCommand],
        ['now', MusicNowCommand],
        ['clear', MusicClearCommand],
        ['seek', MusicSeekCommand],
        ['shuffle', MusicSeekCommand],
    ]),
    logger,
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
                    required: true,
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
                    required: true,
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
                    required: true,
                },
            ],
        },
    ],
});
