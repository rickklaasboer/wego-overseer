import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import ReminderRepository from '@/app/repositories/ReminderRepository';
import Logger from '@/telemetry/logger';
import {tap} from '@/util/misc/tap';
import dayjs, {Dayjs} from 'dayjs';
import {injectable} from 'tsyringe';

function createRandomDateBetween(start: Dayjs, end: Dayjs): Dayjs {
    return tap(start, (date) => {
        date.add(Math.random() * (end.unix() - start.unix()), 'second');
    });
}

@injectable()
export default class RemindMeCommand implements BaseCommand {
    public name = 'remindme';
    public description = 'Get the current version of the bot';
    public options = [
        {
            name: 'reminder',
            description: 'Reminder text',
            required: true,
            type: APPLICATION_COMMAND_OPTIONS.STRING,
        },
        {
            name: 'user',
            description: 'User to set reminder for',
            type: APPLICATION_COMMAND_OPTIONS.USER,
        },
    ];

    constructor(
        private reminderRepository: ReminderRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const reminder = interaction.options.getString('reminder') ?? '';
            const user =
                interaction.options.getUser('user') ?? interaction.user;

            // TODO: Implement reminder logic
            // Probably want to store reminders in a database
            // and have a background task that checks for reminders
            // maybe using a cron job or a queue?

            await this.reminderRepository.create({
                userId: user.id,
                reminder,
                remindAt: createRandomDateBetween(
                    dayjs(),
                    tap(dayjs(), (date) => {
                        date.add(1, 'year');
                    }),
                ).toDate(),
            });

            await interaction.reply(
                `Reminder set for ${user.username}: ${reminder}`,
            );
        } catch (err) {
            this.logger.fatal('Failed to create reminder', err);
        }
    }
}
