import BaseEntrypointCommand from '@/app/commands/BaseEntrypointCommand';
import {APPLICATION_COMMAND_OPTIONS} from '@/app/commands/BaseCommand';
import KarmaChannelEnableCommand from '@/app/commands/karma/KarmaChannelEnableCommand';
import KarmaChannelDisableCommand from '@/app/commands/karma/KarmaChannelDisableCommand';
import KarmaLeaderboardGetCommand from '@/app/commands/karma/KarmaLeaderboardGetCommand';
import KarmaUserGetCommand from '@/app/commands/karma/KarmaUserGetCommand';
import KarmaUserResetCommand from '@/app/commands/karma/KarmaUserResetCommand';
import KarmaUserGraphCommand from '@/app/commands/karma/KarmaUserGraphCommand';
import {Commandable} from '@/types/util';
import {injectable} from 'tsyringe';
import KarmaPersonalityCommand from '@/app/commands/karma/KarmaPersonalityCommand';

@injectable()
export default class KarmaCommand extends BaseEntrypointCommand {
    public name = 'karma';
    public description = "Wego Overseer's karma system";
    public forwardables = new Map<string, Commandable>([
        ['enablechannel', KarmaChannelEnableCommand],
        ['disablechannel', KarmaChannelDisableCommand],
        ['leaderboard', KarmaLeaderboardGetCommand],
        ['getuser', KarmaUserGetCommand],
        ['resetuser', KarmaUserResetCommand],
        ['getgraph', KarmaUserGraphCommand],
        ['personality', KarmaPersonalityCommand],
    ]);
    public options = [
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'enablechannel',
            description: 'Enable karma for a channel',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                    name: 'channel',
                    description: 'Channel to enable karma for',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'disablechannel',
            description: 'Disable karma for a channel',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                    name: 'channel',
                    description: 'Channel to disable karma for',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'getuser',
            description: 'Get karma of user',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to get karma for',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'resetuser',
            description: 'Reset karma',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to reset karma for',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'leaderboard',
            description: 'Get karma leaderboard',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                    name: 'channel',
                    description: 'Channel to get leaderboard for',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'getgraph',
            description: 'Get karmagraph of user',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to get karma graph for',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'personality',
            description: 'Get karma personality',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to get karma personality for',
                },
            ],
        },
    ];
}
