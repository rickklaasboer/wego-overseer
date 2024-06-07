import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import GuildUserRepository from '@/app/repositories/GuildUserRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class BindUserToGuild<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseMiddleware<T> {
    constructor(private guildUserRepository: GuildUserRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const userId = (ctx.options.getUser('user') ?? ctx.user).id;
        const guildId = ctx.guildId ?? '';

        const exists = await this.guildUserRepository.exists(guildId, userId);

        if (!exists) {
            await this.guildUserRepository.create({guildId, userId});
        }

        await next(ctx);
    }
}
