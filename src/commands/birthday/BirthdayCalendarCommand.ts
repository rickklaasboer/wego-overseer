import {trans} from '@/util/localization';
import {ensureGuildIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import Logger from '@/telemetry/logger';
import {EmbedBuilder} from '@discordjs/builders';
import {tableWithHead} from '@/util/table';
import dayjs from 'dayjs';
import {wrapInCodeblock} from '@/util/discord';

const logger = new Logger('wego-overseer:BirthdayCalendarCommand');

export const BirthdayCalendarCommand = new InternalCommand({
    run: async (interaction, _, {client}) => {
        try {
            const guild = await ensureGuildIsAvailable(interaction.guildId);

            const birthdays = await guild
                .$query()
                .withGraphFetched({users: true})
                .modifyGraph('users', (q) => {
                    q.orderBy('dateOfBirth', 'asc');
                });

            const embed = new EmbedBuilder().setTitle(
                `${interaction.guild?.name}'s birthday calendar`,
            );

            const rows = await Promise.all(
                birthdays.users.map(async ({id, dateOfBirth}) => [
                    (await client.users.fetch(id)).username,
                    dayjs(dateOfBirth).format('MM/DD'),
                ]),
            );

            const table = wrapInCodeblock(
                tableWithHead(['User', 'Birthday'], rows),
            );

            embed.setDescription(table);

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            logger.fatal('Unable to handle BirthdayCalendarCommand', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'karma command'),
                ephemeral: true,
            });
        }
    },
});
