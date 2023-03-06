import {trans} from '@/util/localization';
import {EmbedBuilder} from '@discordjs/builders';
import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import dayjs from 'dayjs';
import {daysUntilNextBirthday} from '@/util/birthday';
import Logger from '@/telemetry/logger';
import {default as LocalUser} from '@/entities/User';
import {User as DiscordUser} from 'discord.js';
import {bindUserToGuild} from './predicates/bindUserToGuild';

const logger = new Logger('wego-overseer:BirthdayGetCommand');

function createEmbed(user: LocalUser, discordUser: DiscordUser): EmbedBuilder {
    const embed = new EmbedBuilder();

    embed.setTitle(
        trans('commands.birthday.get.embed.title', discordUser.username),
    );

    if (user.dateOfBirth) {
        embed.setDescription(
            trans(
                'commands.birthday.get.embed.description.birthday_known',
                discordUser.username,
                dayjs(user.dateOfBirth).format('MM/DD'),
                String(daysUntilNextBirthday(new Date(user.dateOfBirth))),
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

export const BirthdayGetCommand = new InternalCommand({
    run: async (interaction, _, {db}) => {
        try {
            const discordUser =
                interaction.options.getUser('user') ?? interaction.user;
            const user = await ensureUserIsAvailable(discordUser.id);
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            await bindUserToGuild(db, user, guild);

            await interaction.followUp({
                embeds: [createEmbed(user, discordUser)],
            });
        } catch (err) {
            logger.fatal('Unable to handle BirthdayGetCommand', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'birthday get command'),
                ephemeral: true,
            });
        }
    },
});
