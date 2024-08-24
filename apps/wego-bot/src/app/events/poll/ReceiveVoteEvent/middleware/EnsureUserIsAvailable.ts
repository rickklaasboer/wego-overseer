import BaseMiddleware, {NextFn} from '@/app/middleware/BaseMiddleware';
import UserRepository from '@/app/repositories/UserRepository';
import {ClientEvents} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class EnsureUserIsAvailable<
    T extends
        ClientEvents['interactionCreate'] = ClientEvents['interactionCreate'],
> extends BaseMiddleware<T> {
    constructor(private userRepository: UserRepository) {
        super();
    }

    /**
     * Run the middleware
     */
    public async handle(ctx: T, next: NextFn<T>): Promise<void> {
        const [interaction] = ctx;
        const exists = await this.userRepository.exists(interaction.user.id);

        if (!exists) {
            await this.userRepository.create({
                id: interaction.user.id,
                username: interaction.user.username,
                avatar: interaction.user.avatar ?? '',
            });
        }

        await next(ctx);
    }
}
