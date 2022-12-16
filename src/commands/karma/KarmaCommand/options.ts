import {
    APPLICATION_COMMAND_OPTIONS,
    SlashCommandOption,
} from '@/commands/Command';

const KARMA_COMMAND_OPTIONS: SlashCommandOption[] = [
    {
        type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND_GROUP,
        name: 'channel',
        description: 'Karma channel sub commands',
        options: [
            {
                type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
                name: 'enable',
                description: 'Enable karma',
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
                name: 'disable',
                description: 'Disable karma',
                options: [
                    {
                        type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                        name: 'channel',
                        description: 'Channel to disable karma for',
                        required: true,
                    },
                ],
            },
        ],
    },
    {
        type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND_GROUP,
        name: 'user',
        description: 'Karma user sub commands',
        options: [
            {
                type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
                name: 'get',
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
                name: 'reset',
                description: 'Reset karma',
                options: [
                    {
                        type: APPLICATION_COMMAND_OPTIONS.USER,
                        name: 'user',
                        description: 'User to reset karma for',
                    },
                ],
            },
        ],
    },
    {
        type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND_GROUP,
        name: 'leaderboard',
        description: 'Karma leaderboard sub commands',
        options: [
            {
                type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
                name: 'get',
                description: 'Get karma leaderboard',
                options: [
                    {
                        type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                        name: 'channel',
                        description: 'Channel to get leaderboard for',
                    },
                ],
            },
        ],
    },
];

export {KARMA_COMMAND_OPTIONS};
