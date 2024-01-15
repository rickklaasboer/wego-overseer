import {randomNumber} from '@/util/karma';
import {trans} from '@/util/localization';
import BaseEvent from '@/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class BangerEvent implements BaseEvent<'messageCreate'> {
    public name = 'BangerEvent';
    public event = 'messageCreate' as const;

    constructor(private logger: Logger) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            // Split string into words
            const text = message.content
                .toLowerCase()
                .replace(/\b(\w)/g, (s) => s.toUpperCase());
            const words = text.split(' ');
            const word = words.find((word) => word.endsWith('er'));

            // Super 100% random chance if the event should fire or not
            // this is to prevent spam
            const shouldFire = randomNumber(1, 10) === 7;
            if (!(shouldFire && word && word.length >= 5)) return;

            await message.reply(trans('events.banger.msg', word));
        } catch (err) {
            this.logger.fatal('Failed to run BangerEvent', err);
        }
    }
}
