import BaseEvent from '@/events/BaseEvent';
import {Message} from 'discord.js';

export default class YoloSwagEvent implements BaseEvent<'messageCreate'> {
    public name = 'YoloSwagEvent';
    public event = 'messageCreate' as const;

    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            if (message.content.toLowerCase().includes('yolo')) {
                await message.reply('swag');
            }
        } catch (err) {
            console.error('Unable to handle YoloSwagEvent', err);
        }
    }
}
