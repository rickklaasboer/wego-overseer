import {trans} from '@/util/localization';
import {EmbedBuilder} from '@discordjs/builders';
import dayjs from 'dayjs';
import {createNextOccuranceTimestamp} from '@/util/timestamp';
import table from 'text-table';
import Guild from '@/entities/Guild';
import User from '@/entities/User';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import {DefaultInteraction} from '@/commands/BaseCommand';
import EnsureGuildIsAvailable from '@/middleware/EnsureGuildIsAvailable';
import GuildRepository from '@/repositories/GuildRepository';
import {injectable} from 'tsyringe';

@injectable()
export default class BirthdayCalendarCommand extends BaseInternalCommand {
    public middleware = [EnsureGuildIsAvailable];

    constructor(private guildRepository: GuildRepository) {
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

            const guildSortedByBirthday = sortBirthdays(guild);
            const rows = await createBirthdayRows(guildSortedByBirthday);

            embed.setDescription(table(rows));

            await interaction.followUp({
                embeds: [embed],
            });
        } catch (err) {
            console.error(err);
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

// TODO: move
// also rename because it sortes users in guild by birthday, not the birthdays themselves
export function sortBirthdays(guild: Guild) {
    return guild.users.sort(({dateOfBirth: a}, {dateOfBirth: b}) => {
        const now = dayjs();
        const birthdayA = dayjs(a).year(now.year());
        const birthdayB = dayjs(b).year(now.year());

        if (birthdayA.isBefore(now) && birthdayB.isAfter(now)) return 1;
        if (birthdayA.isAfter(now) && birthdayB.isBefore(now)) return -1;
        if (birthdayA.isBefore(birthdayB)) return -1;
        if (birthdayA.isAfter(birthdayB)) return 1;

        return 0;
    });
}

// TODO: move
// also i dont know why this is async
// probably doesnt need to be
export async function createBirthdayRows(guild: User[]) {
    return await Promise.all(
        guild.map(async ({id, dateOfBirth}) => {
            return [
                `${dayjs(dateOfBirth).format(
                    'DD/MM/YYYY',
                )} - <@${id}> (${createNextOccuranceTimestamp(
                    dayjs(dateOfBirth),
                )})`,
            ];
        }),
    );
}
