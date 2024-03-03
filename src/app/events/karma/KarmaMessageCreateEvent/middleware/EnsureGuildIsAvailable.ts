import Guild from '@/app/entities/Guild';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import GuildRepository from '@/app/repositories/GuildRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageCreate'];

@injectable()
export default class EnsureGuildIsAvailable<
    T extends Event = Event,
> extends BaseMiddleware<T> {
    constructor(private guildRepository: GuildRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [message] = ctx;

        const guildId = message.guild?.id;
        if (!guildId) {
            throw new Error('Guild is not available');
        }

        const exists = await this.guildRepository.exists(guildId);

        if (!exists) {
            await this.guildRepository.create({id: guildId});
        }

        await next(ctx);
    }
}
