import Logger from '@/telemetry/logger';
import {isAdmin} from '@/util/discord';
import {trans} from '@/util/localization';
import {pad} from '@/util/misc';
import dayjs, {Dayjs} from 'dayjs';
import InternalCommand from '../InternalCommand';
import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '../karma/KarmaCommand/predicates';
import {bindUserToGuild} from './predicates/bindUserToGuild';
import {EmbedBuilder, User} from 'discord.js';
import {createNextOccuranceTimestamp} from '@/util/timestamp';

const logger = new Logger('wego-overseer:commands:BirthdaySetCommand');

class NotAdminError extends Error {
    constructor() {
        super(
            "Requester tried to change target's birthday, but is not an administrator.",
        );

        this.name = 'NotAdminError';
    }
}

function createEmbed(target: User, requester: User, date: Dayjs) {
    const embed = new EmbedBuilder();

    embed.setTitle(trans('commands.birthday.set.embed.title', target.username));

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

export const BirthdaySetCommand = new InternalCommand({
    run: async (interaction, _, {db}) => {
        try {
            const requester = interaction.user;
            const target = interaction.options.getUser('user') ?? requester;

            const user = await ensureUserIsAvailable(target?.id);
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            await bindUserToGuild(db, user, guild);

            // If requester is not an admin, but tries to change someone else's birthday
            if (requester.id !== target?.id && !isAdmin(interaction)) {
                throw new NotAdminError();
            }

            const birthDate = [
                interaction.options.getNumber('year'),
                pad(interaction.options.getNumber('month'), 2),
                pad(interaction.options.getNumber('day'), 2),
            ];

            await user.$query().update({
                dateOfBirth: dayjs(birthDate.join('/')).format('YYYY-MM-DD'),
            });

            const date = dayjs(birthDate.join('/'));

            await interaction.followUp({
                embeds: [createEmbed(target, requester, date)],
            });
        } catch (error) {
            logger.fatal('Unable to handle BirthdaySetCommand', error);

            if (error instanceof NotAdminError) {
                await interaction.followUp(
                    trans('commands.birthday.set.not_admin'),
                );
                return;
            }

            await interaction.followUp(trans('commands.birthday.set.failure'));
        }
    },
});
