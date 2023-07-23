import {trans} from '@/util/localization';
import {ensureGuildIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import Logger from '@/telemetry/logger';
import dayjs from 'dayjs';
import {EmbedBuilder} from 'discord.js';
import table from 'text-table';
import {createBirthdayRows, sortBirthdays} from './BirthdayCalendarCommand';

const logger = new Logger('wego-overseer:commands:BirthdayUpcomingCommand');

export const BirthdayUpcomingCommand = new InternalCommand({
    run: async (interaction) => {
        try {
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            const now = dayjs();

            const birthdays = await guild
                .$query()
                .withGraphFetched({users: true})
                .modifyGraph('users', (q) => {
                    q.whereRaw(
                        "(DATE_FORMAT(dateOfBirth, '%m-%d') BETWEEN ? and ?)",
                        [
                            now.format('MM-DD'),
                            now.add(3, 'months').format('MM-DD'),
                        ],
                    );
                });

            const embed = new EmbedBuilder().setTitle(
                trans(
                    'commands.birthday.upcoming.embed.title',
                    interaction.guild?.name ?? '',
                    '3 months',
                ),
            );

            const birthdaysSorted = sortBirthdays(birthdays);
            const rows = await createBirthdayRows(birthdaysSorted);

            embed.setDescription(table(rows));

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            logger.fatal('Unable to handle BirthdayUpcomingCommand', err);
            await interaction.followUp({
                content: trans(
                    'errors.common.failed',
                    'birthday upcoming command',
                ),
                ephemeral: true,
            });
        }
    },
});
