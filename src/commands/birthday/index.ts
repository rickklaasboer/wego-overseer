import EntryPointCommand from '@/commands/EntryPointCommand';
import {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {BirthdayGetCommand} from '@/commands/birthday/BirthdayGetCommand';
import {BirthdaySetCommand} from '@/commands/birthday/BirthdaySetCommand';
import {BirthdaySetChannelCommand} from '@/commands/birthday/BirthdaySetChannelCommand';
import {BirthdayUpcomingCommand} from './BirthdayUpcomingCommand';
import {BirthdayCalendarCommand} from './BirthdayCalendarCommand';

export const BirthdayCommand = new EntryPointCommand({
    name: 'birthday',
    description:
        'Birthdays! (by entering your date of birth you agree to us selling your soul)',
    forwardables: new Map([
        ['get', BirthdayGetCommand],
        ['set', BirthdaySetCommand],
        ['setchannel', BirthdaySetChannelCommand],
        ['upcoming', BirthdayUpcomingCommand],
        ['calendar', BirthdayCalendarCommand],
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
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'date_year',
                    description: 'Date of birth (yyyy)',
                    min_value: 1900,
                    max_value: new Date().getFullYear(),
                    required: true,
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'date_month',
                    description: 'Date of birth (mm)',
                    min_value: 1,
                    max_value: 12,
                    required: true,
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'date_day',
                    description: 'Date of birth (dd)',
                    min_value: 1,
                    max_value: 31,
                    required: true,
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.USER,
                    name: 'user',
                    description: 'User to set birthday for (defaults to self)',
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'setchannel',
            description: "Set's channel to send birthday messages in",
            options: [
                {
                    type: APPLICATION_COMMAND_OPTIONS.CHANNEL,
                    name: 'channel',
                    description: 'channel to send birthday messages in',
                    required: true,
                },
            ],
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'upcoming',
            description: 'Get upcoming birthdays',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.SUB_COMMAND,
            name: 'calendar',
            description: "Get the server's birthday calendar",
        },
    ],
});
