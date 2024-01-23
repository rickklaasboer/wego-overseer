import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import dayjs from 'dayjs';
import {default as LocalUser} from '@/app/entities/User';
import {User as DiscordUser} from 'discord.js';
import {createNextOccuranceTimestamp} from '@/util/timestamp';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import EnsureUserIsAvailable from '@/app/middleware/commands/EnsureUserIsAvailable';
import EnsureGuildIsAvailable from '@/app/middleware/commands/EnsureGuildIsAvailable';
import UserRepository from '@/app/repositories/UserRepository';
import {Maybe} from '@/types/util';
import BindUserToGuild from '@/app/middleware/commands/BindUserToGuild';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class BirthdayGetCommand extends BaseInternalCommand {
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

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const interactionUser =
                interaction.options.getUser('user') ?? interaction.user;

            const user = await this.userRepository.getById(interactionUser.id);

            await interaction.followUp({
                embeds: [this.createEmbed(user, interactionUser)],
            });
        } catch (err) {
            this.logger.fatal('Failed to get birthday', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'birthday get command'),
                ephemeral: true,
            });
        }
    }

    /**
     * Create the embed
     */
    private createEmbed(
        user: Maybe<LocalUser>,
        discordUser: DiscordUser,
    ): EmbedBuilder {
        const embed = new EmbedBuilder();

        embed.setTitle(
            trans('commands.birthday.get.embed.title', discordUser.username),
        );

        if (user?.dateOfBirth) {
            embed.setDescription(
                trans(
                    'commands.birthday.get.embed.description.birthday_known',
                    discordUser.username,
                    dayjs(user.dateOfBirth).format('DD/MM/YYYY'),
                    createNextOccuranceTimestamp(dayjs(user.dateOfBirth)),
                ),
            );
        } else {
            embed.setDescription(
                trans(
                    'commands.birthday.get.embed.description.birthday_unknown',
                    discordUser.username,
                ),
            );
        }

        embed.setThumbnail(discordUser.displayAvatarURL());
        embed.setFooter({
            text: trans('commands.birthday.get.embed.footer', discordUser.tag),
            iconURL: discordUser.displayAvatarURL(),
        });

        return embed;
    }
}
