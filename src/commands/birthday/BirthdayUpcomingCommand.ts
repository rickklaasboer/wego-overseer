import {trans} from '@/util/localization';
import {ensureGuildIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import InternalCommand from '../InternalCommand';
import Logger from '@/telemetry/logger';
import dayjs from 'dayjs';
import {wrapInCodeblock} from '@/util/discord';
import {tableWithHead} from '@/util/table';
import {EmbedBuilder} from 'discord.js';

const logger = new Logger('wego-overseer:BirthdayUpcomingCommand');

export const BirthdayUpcomingCommand = new InternalCommand({
    run: async (interaction, _, {client}) => {
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
                    ).orderBy('dateOfBirth', 'desc');
                });

            const embed = new EmbedBuilder().setTitle(
                `${interaction.guild?.name}'s upcoming birthdays (3 months)`,
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
            logger.fatal('Unable to handle BirthdayUpcomingCommand', err);
            await interaction.followUp({
                content: trans('errors.common.failed', 'karma command'),
                ephemeral: true,
            });
        }
    },
});
