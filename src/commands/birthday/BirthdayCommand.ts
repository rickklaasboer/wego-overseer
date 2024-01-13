import BirthdayGetCommand from '@/commands/birthday/BirthdayGetCommand';
import BirthdaySetCommand from '@/commands/birthday/BirthdaySetCommand';
import BirthdaySetChannelCommand from '@/commands/birthday/BirthdaySetChannelCommand';
import BirthdayUpcomingCommand from './BirthdayUpcomingCommand';
import BirthdayCalendarCommand from './BirthdayCalendarCommand';
import BaseEntrypointCommand from '@/commands/BaseEntrypointCommand';
import {Commandable} from '@/types/util';
import {injectable} from 'tsyringe';
import {APPLICATION_COMMAND_OPTIONS} from '@/commands/BaseCommand';

@injectable()
export default class BirthdayCommand extends BaseEntrypointCommand {
    public name = 'birthday';
    public description = "Wego overseer's birthday bonanza";
    public forwardables = new Map<string, Commandable>([
        ['get', BirthdayGetCommand],
        ['set', BirthdaySetCommand],
        ['setchannel', BirthdaySetChannelCommand],
        ['upcoming', BirthdayUpcomingCommand],
        ['calendar', BirthdayCalendarCommand],
    ]);
    public options = [
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
                    name: 'year',
                    description: 'Date of birth (yyyy)',
                    min_value: 1900,
                    max_value: new Date().getFullYear(),
                    required: true,
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'month',
                    description: 'Date of birth (mm)',
                    min_value: 1,
                    max_value: 12,
                    required: true,
                },
                {
                    type: APPLICATION_COMMAND_OPTIONS.NUMBER,
                    name: 'day',
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
    ];
    public enabled = true;
}
