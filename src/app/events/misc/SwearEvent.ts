import BaseEvent from '@/app/events/BaseEvent';
import Logger from '@/telemetry/logger';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class SwearEvent implements BaseEvent<'messageCreate'> {
    public name = 'SwearEvent';
    public event = 'messageCreate' as const;

    constructor(private logger: Logger) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;
        } catch (err) {
            this.logger.fatal('Failed to run SwearEvent', err);
        }
    }
}
