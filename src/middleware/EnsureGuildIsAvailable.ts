import {DefaultInteraction} from '@/commands/BaseCommand';
import Guild from '@/entities/Guild';
import BaseMiddleware, {NextFn} from '@/middleware/BaseMiddleware';
import GuildRepository from '@/repositories/GuildRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class EnsureGuildIsAvailable<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseMiddleware<T> {
    constructor(private guildRepository: GuildRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const guildId = ctx.guildId ?? '';
        const guild = await this.guildRepository.getById(guildId);

        if (!(guild instanceof Guild)) {
            await this.guildRepository.create({id: guildId});
        }

        await next(ctx);
    }
}
