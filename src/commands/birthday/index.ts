import EntryPointCommand from '@/commands/EntryPointCommand';
import {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {BirthdayGetCommand} from '@/commands/birthday/BirthdayGetCommand';
import {BirthdaySetCommand} from '@/commands/birthday/BirthdaySetCommand';

export const BirthdayCommand = new EntryPointCommand({
    name: 'birthday',
    description:
        'Birthdays! (by entering your date of birth you agree to us selling your soul)',
    forwardables: new Map([
        ['get', BirthdayGetCommand],
        ['set', BirthdaySetCommand],
    ]),
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'get',
            description: "Get a user's birthday",
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to get birthday from',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'set',
            description: "Set a user's birthday",
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to set birthday for (defaults to self)',
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.STRING,
                    name: 'date',
                    description: 'Date of birth (yyyy/mm/dd)',
                },
            ],
        },
    ],
});
