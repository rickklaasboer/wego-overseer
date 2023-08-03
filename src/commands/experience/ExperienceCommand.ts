import Logger from '@/telemetry/logger';
import {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import EntryPointCommand from '@/commands/EntryPointCommand';
import {ExperienceGetCommand} from '@/commands/experience/ExperienceGetCommand';
import {ExperienceAddCommand} from '@/commands/experience/ExperienceAddCommand';
import {ExperienceSetCommand} from '@/commands/experience/ExperienceSetCommand';
import {ExperienceResetCommand} from '@/commands/experience/ExperienceResetCommand';
import {ExperienceRemoveCommand} from '@/commands/experience/ExperienceRemoveCommand';
import {ExperienceLeaderboardCommand} from '@/commands/experience/ExperienceLeaderboardCommand';

const logger = new Logger('wego-overseer:commands:ExperienceCommand');

export const ExperienceCommand = new EntryPointCommand({
    name: 'experience',
    description: 'Manage experience',
    forwardables: new Map([
        ['get', ExperienceGetCommand],
        ['set', ExperienceSetCommand],
        ['add', ExperienceAddCommand],
        ['remove', ExperienceRemoveCommand],
        ['reset', ExperienceResetCommand],
        ['leaderboard', ExperienceLeaderboardCommand],
    ]),
    logger,
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'get',
            description: 'Get experience',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'The user to get experience for',
                    required: false,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'set',
            description: 'Set experience',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'The user to set experience for',
                    required: true,
                },
                {
                    name: 'amount',
                    type: APPLICATION_COMMAND_OPTIONS.INTEGER,
                    description: 'The amount of experience to set',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'add',
            description: 'Add experience',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'The user to add experience for',
                    required: true,
                },
                {
                    name: 'amount',
                    type: APPLICATION_COMMAND_OPTIONS.INTEGER,
                    description: 'The amount of experience to add',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'remove',
            description: 'Remove experience',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'The user to remove experience from',
                    required: true,
                },
                {
                    name: 'amount',
                    type: APPLICATION_COMMAND_OPTIONS.INTEGER,
                    description: 'The amount of experience to remove',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'reset',
            description: 'Reset experience',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'The user to reset experience for',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'leaderboard',
            description: 'Get the experience leaderboard',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.BOOLEAN,
                    name: 'web',
                    description: 'Whether to get the web version',
                    required: false,
                },
            ],
        },
    ],
});
