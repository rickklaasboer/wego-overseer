import BaseEvent from '@/app/events/BaseEvent';
import Logger from '@/telemetry/logger';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class YoloSwagEvent implements BaseEvent<'messageCreate'> {
    public name = 'YoloSwagEvent';
    public event = 'messageCreate' as const;

    constructor(private logger: Logger) {}

    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            if (message.content.toLowerCase().includes('yolo')) {
                await message.reply('swag');
            }
        } catch (err) {
            this.logger.fatal('Failed to run YoloSwagEvent', err);
        }
    }
}
