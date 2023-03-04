import {trans} from '@/util/localization';
import {EmbedBuilder} from '@discordjs/builders';
import {ensureUserIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import dayjs from 'dayjs';
import {daysUntilNextBirthday} from '@/util/birthday';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:BirthdayGetCommand');

export const BirthdayGetCommand = new InternalCommand({
    run: async (interaction) => {
        try {
            const interactionUser =
                interaction.options.getUser('user') ?? interaction.user;
            const user = await ensureUserIsAvailable(interactionUser.id);

            const embed = new EmbedBuilder()
                .setTitle(
                    trans(
                        'commands.birthday.get.embed.title',
                        interactionUser.username,
                    ),
                )
                .setDescription(
                    user.dateOfBirth
                        ? trans(
                              'commands.birthday.get.embed.description.birthday_known',
                              interactionUser.username,
                              dayjs(user.dateOfBirth).format('MM/DD'),
                              String(
                                  daysUntilNextBirthday(
                                      new Date(user.dateOfBirth),
                                  ),
                              ),
                          )
                        : trans(
                              'commands.birthday.get.embed.description.birthday_unknown',
                              interactionUser.username,
                          ),
                )
                .setThumbnail(interactionUser.displayAvatarURL())
                .setFooter({
                    text: trans(
                        'commands.birthday.get.embed.footer',
                        interactionUser.tag,
                    ),
                    iconURL: interactionUser.displayAvatarURL(),
                });

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            logger.fatal('Unable to handle BirthdayGetCommand', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'karma command'),
                ephemeral: true,
            });
        }
    },
});
