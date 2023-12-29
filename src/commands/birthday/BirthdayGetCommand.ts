import InternalBaseCommand from '@/commands/InternalBaseCommand';
import {default as LocalUser} from '@/entities/User';
import UserRepository from '@/repositories/UserRepository';
import {Maybe} from '@/types/util';
import {trans} from '@/util/localization';
import {createNextOccuranceTimestamp} from '@/util/timestamp';
import dayjs from 'dayjs';
import {
    ChatInputCommandInteraction,
    CacheType,
    EmbedBuilder,
    User as DiscordUser,
} from 'discord.js';
import {injectable} from 'inversify';

function createEmbed(
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

@injectable()
export default class BirthdayGetCommand extends InternalBaseCommand {
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        super();
        this.userRepository = userRepository;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        try {
            const user = await this.userRepository.getByGuildId(
                interaction.user.id,
                interaction.guildId!,
            );

            const embed = createEmbed(user, interaction.user);

            await interaction.reply({
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
        }
    }
}
