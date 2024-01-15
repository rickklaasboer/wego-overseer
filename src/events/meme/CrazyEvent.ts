import Logger from '@/telemetry/logger';
import BaseEvent from '@/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class CrazyEvent implements BaseEvent<'messageCreate'> {
    public name = 'CrazyEvent';
    public event = 'messageCreate' as const;
    private possibleReplies = new Map([
        ['crazy', 'Crazy? I was crazy once.'],
        ['they locked me in a room', 'A rubber room'],
        ['a rubber room with rats', 'And rats make me crazy!'],
    ]);

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            const msg = message.content.toLowerCase();

            if (this.possibleReplies.has(msg)) {
                await message.reply(this.possibleReplies.get(msg)!);
            } else if (msg.includes('crazy')) {
                await message.reply(this.possibleReplies.get('crazy')!);
            }
        } catch (err) {
            console.error('Unable to handle CrazyEvent', err);
        }
    }
}
