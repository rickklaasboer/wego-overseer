import Logger from '@/telemetry/logger';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {pad} from '@/util/misc';
import dayjs, {Dayjs} from 'dayjs';
import {EmbedBuilder, User} from 'discord.js';
import {createNextOccuranceTimestamp} from '@/util/timestamp';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BindUserToGuild from '@/app/middleware/commands/BindUserToGuild';
import EnsureGuildIsAvailable from '@/app/middleware/commands/EnsureGuildIsAvailable';
import EnsureUserIsAvailable from '@/app/middleware/commands/EnsureUserIsAvailable';
import UserRepository from '@/app/repositories/UserRepository';
import {injectable} from 'tsyringe';
import {AuthorizationError} from '@/util/errors/AuthorizationError';

@injectable()
export default class BirthdaySetCommand extends BaseInternalCommand {
    public middleware = [
        EnsureUserIsAvailable,
        EnsureGuildIsAvailable,
        BindUserToGuild,
    ];

    constructor(
        private userRepository: UserRepository,
        private logger: Logger,
    ) {
        super();
    }

    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const requester = interaction.user;
            const target = interaction.options.getUser('user') ?? requester;

            // If requester is not an admin, but tries to change someone else's birthday
            if (requester.id !== target?.id && !isAdmin(interaction)) {
                this.logger.info(
                    'User tried to set birthday of other user, but did not have permission',
                );
                throw new AuthorizationError();
            }

            const birthDate = [
                interaction.options.getNumber('year'),
                pad(interaction.options.getNumber('month'), 2),
                pad(interaction.options.getNumber('day'), 2),
            ];

            await this.userRepository.update(target.id, {
                dateOfBirth: dayjs(birthDate.join('/')).format('YYYY-MM-DD'),
            });

            const date = dayjs(birthDate.join('/'));

            await interaction.followUp({
                embeds: [this.createEmbed(target, requester, date)],
            });
        } catch (error) {
            this.logger.fatal('Failed to set birthday', error);

            if (error instanceof AuthorizationError) {
                await interaction.followUp(
                    trans('commands.birthday.set.not_admin'),
                );
                return;
            }

            await interaction.followUp(trans('commands.birthday.set.failure'));
        }
    }

    /**
     * Create the embed
     */
    private createEmbed(
        target: User,
        requester: User,
        date: Dayjs,
    ): EmbedBuilder {
        const embed = new EmbedBuilder();

        embed.setTitle(
            trans('commands.birthday.set.embed.title', target.username),
        );

        embed.setDescription(
            requester.id === target.id
                ? trans(
                      'commands.birthday.set.embed.description.success',
                      date.format('DD/MM/YYYY'),
                      createNextOccuranceTimestamp(date),
                  )
                : trans(
                      'commands.birthday.set.embed.description.other_user',
                      target.username,
                      date.format('DD/MM/YYYY'),
                      createNextOccuranceTimestamp(date),
                  ),
        );

        embed.setThumbnail(target.displayAvatarURL());
        embed.setFooter({
            text: trans('commands.birthday.set.embed.footer', requester.tag),
            iconURL: requester.displayAvatarURL(),
        });
        return embed;
    }
}
