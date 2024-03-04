import BaseEvent from '@/app/events/BaseEvent';
import ComprehendService from '@/app/services/aws/ComprehendService';
import Logger from '@/telemetry/logger';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class SwearEvent implements BaseEvent<'messageCreate'> {
    public name = 'SwearEvent';
    public event = 'messageCreate' as const;

    constructor(
        private comprehendService: ComprehendService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            if (message.author.bot) return;

            // TODO: Implement

            // await message.reply('Please do not swear!');
        } catch (err) {
            this.logger.fatal('Failed to run SwearEvent', err);
        }
    }
}
