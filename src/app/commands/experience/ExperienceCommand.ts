import {APPLICATION_COMMAND_OPTIONS} from '@/app/commands/BaseCommand';
import BaseEntrypointCommand from '@/app/commands/BaseEntrypointCommand';
import ExperienceAddCommand from '@/app/commands/experience/ExperienceAddCommand';
import ExperienceGetCommand from '@/app/commands/experience/ExperienceGetCommand';
import ExperienceImportCommand from '@/app/commands/experience/ExperienceImportCommand';
import ExperienceLeaderboardCommand from '@/app/commands/experience/ExperienceLeaderboardCommand';
import ExperienceRemoveCommand from '@/app/commands/experience/ExperienceRemoveCommand';
import ExperienceResetCommand from '@/app/commands/experience/ExperienceResetCommand';
import ExperienceSetCommand from '@/app/commands/experience/ExperienceSetCommand';
import {Commandable} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class ExperienceCommand extends BaseEntrypointCommand {
    public name = 'experience';
    public description = 'Manage experience';
    public forwardables = new Map<string, Commandable>([
        ['get', ExperienceGetCommand],
        ['add', ExperienceAddCommand],
        ['set', ExperienceSetCommand],
        ['remove', ExperienceRemoveCommand],
        ['reset', ExperienceResetCommand],
        ['leaderboard', ExperienceLeaderboardCommand],
        ['import', ExperienceImportCommand],
    ]);
    public options = [
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
                    min_value: 0,
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
                    min_value: 1,
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
                    min_value: 1,
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
            // TODO: Add this option when the web version is done
            // options: [
            //     {
            //         type: APPLICATION_COMMAND_OPTIONS.BOOLEAN,
            //         name: 'web',
            //         description: 'Whether to get the web version',
            //         required: false,
            //     },
            // ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'import',
            description: 'Import experience from mee6',
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.ATTACHMENT,
                    name: 'file',
                    description:
                        'The file to import (make sure it is a .json file!)',
                    required: true,
                },
            ],
        },
    ];
}
