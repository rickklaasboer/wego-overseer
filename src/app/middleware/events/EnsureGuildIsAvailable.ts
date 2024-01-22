import Guild from '@/app/entities/Guild';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import GuildRepository from '@/app/repositories/GuildRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

type Event = ClientEvents['messageReactionAdd' | 'messageReactionRemove'];

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
        const [reaction] = ctx;

        // Discord provides incomplete message on messageReactionAdd
        await reaction.message.fetch();

        const guildId = reaction.message.guild?.id;
        if (!guildId) {
            throw new Error('Guild is not available');
        }

        const guild = await this.guildRepository.getById(guildId);

        if (!(guild instanceof Guild)) {
            await this.guildRepository.create({id: guildId});
        }

        await next(ctx);
    }
}
