import {trans} from '@/util/localization/localization';
import {EmbedBuilder} from 'discord.js';
import table from 'text-table';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/app/commands/BaseCommand';
import EnsureGuildIsAvailable from '@/app/middleware/commands/EnsureGuildIsAvailable';
import GuildRepository from '@/app/repositories/GuildRepository';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';
import {sortUsersByBirthday, createBirthdayRows} from '@/util/misc/birthday';

@injectable()
export default class BirthdayCalendarCommand extends BaseInternalCommand {
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
            const guild = await this.guildRepository.getGuildByIdWithBirthdays(
                interaction.guildId!,
            );

            const embed = new EmbedBuilder().setTitle(
                trans(
                    'commands.birthday.calendar.embed.title',
                    interaction.guild?.name ?? '',
                ),
            );

            if (!guild) {
                throw new Error('Guild not found');
            }

            const guildSortedByBirthday = sortUsersByBirthday(guild);
            const rows = await createBirthdayRows(guildSortedByBirthday);

            embed.setDescription(table(rows));

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            this.logger.fatal('Failed to get birthday calendar', err);
            await interaction.followUp({
                content: trans(
                    'errors.common.failed',
                    'birthday calendar command',
                ),
                ephemeral: true,
            });
        }
    }
}
