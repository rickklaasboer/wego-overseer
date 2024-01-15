import {trans} from '@/util/localization';
import dayjs from 'dayjs';
import {EmbedBuilder} from 'discord.js';
import table from 'text-table';
import {createBirthdayRows, sortBirthdays} from './BirthdayCalendarCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import EnsureGuildIsAvailable from '@/middleware/EnsureGuildIsAvailable';
import GuildRepository from '@/repositories/GuildRepository';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class BirthdayUpcomingCommand extends BaseInternalCommand {
    public middleware = [EnsureGuildIsAvailable];

    constructor(
        private guildRepository: GuildRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const now = dayjs();

            // Lets keep this on one line for now
            // prettier-ignore
            const guild = await this.guildRepository.getGuildByIdWithUpcomingBirthdaysBetween(
                interaction.guildId!,
                [now.format('MM-DD'), now.add(3, 'months').format('MM-DD')],
            );

            if (!guild) {
                throw new Error('Guild not found');
            }

            const embed = new EmbedBuilder().setTitle(
                trans(
                    'commands.birthday.upcoming.embed.title',
                    interaction.guild?.name ?? '',
                    '3 months',
                ),
            );

            const guildSortedByBirthday = sortBirthdays(guild);
            const rows = await createBirthdayRows(guildSortedByBirthday);
            const upcomingBirtdaysTable = table(rows);

            // TODO: handle
            if (upcomingBirtdaysTable.length < 1) {
                this.logger.info(
                    'Tried getting upcoming birthdays but there were none within 3 months',
                );
                throw new Error('No upcoming birthdays found');
            }

            embed.setDescription(table(rows));

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            this.logger.fatal('Failed to get upcoming birthdays', err);
            await interaction.followUp({
                content: trans(
                    'errors.common.failed',
                    'birthday upcoming command',
                ),
                ephemeral: true,
            });
        }
    }
}
