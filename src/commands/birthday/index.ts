import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    SlashCommandOption,
} from '@/commands/BaseCommand';
import BirthdayGetCommand from '@/commands/birthday/BirthdayGetCommand';
import BindUserToGuild from '@/middleware/BindUserToGuild';
import EnsureGuildIsAvailable from '@/middleware/EnsureGuildIsAvailable';
import EnsureUserIsAvailable from '@/middleware/EnsureUserIsAvailable';
import {Maybe} from '@/types/util';
import {withForward} from '@/util/forwardables';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {Container, injectable} from 'inversify';

const options = [
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

@injectable()
export default class BirthdayCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;
    public middleware = [
        EnsureUserIsAvailable,
        EnsureGuildIsAvailable,
        BindUserToGuild,
    ];

    private container: Container;

    constructor(container: Container) {
        super();
        this.name = 'birthday';
        this.description = 'The birthday calendar';
        this.options = options;
        this.enabled = true;
        this.container = container;
    }

    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const forwardables = new Map([
            ['get', BirthdayGetCommand],
            // ['set', BirthdaySetCommand],
            // ['setchannel', BirthdaySetChannelCommand],
            // ['upcoming', BirthdayUpcomingCommand],
            // ['calendar', BirthdayCalendarCommand],
        ]);

        return await withForward(interaction, forwardables, this.container);
    }
}
