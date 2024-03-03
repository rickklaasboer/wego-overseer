import {DefaultInteraction} from '@/app/commands/BaseCommand';
import Guild from '@/app/entities/Guild';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import GuildRepository from '@/app/repositories/GuildRepository';
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
        const exists = await this.guildRepository.exists(guildId);

        if (!exists) {
            await this.guildRepository.create({id: guildId});
        }

        await next(ctx);
    }
}
