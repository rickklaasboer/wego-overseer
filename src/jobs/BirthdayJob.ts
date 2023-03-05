import {BotContext} from '@/Bot';
import User from '@/entities/User';
import {trans} from '@/util/localization';
import {noop} from '@/util/misc';
import {CronJob} from 'cron';
import dayjs from 'dayjs';
import {EmbedBuilder} from 'discord.js';

export const BirthdayJob = new CronJob(
    '0 12 * * *',
    noop,
    null,
    false,
    // TODO: change to UTC?
    'Europe/Amsterdam',
);

export async function onTick({client}: BotContext): Promise<void> {
    const users = await User.query()
        .where('dateOfBirth', 'LIKE', dayjs().format('____-MM-DD'))
        .withGraphFetched({guilds: true});

    for (const user of users) {
        for (const guild of user.guilds) {
            const channel = await client.channels.fetch(
                guild.birthdayChannelId,
            );
            const person = await client.users.fetch(user.id);

            const embed = new EmbedBuilder()
                .setTitle(trans('jobs.birthday.embed.title', person.username))
                .setDescription(
                    trans('jobs.birthday.embed.description', person.id),
                )
                .setThumbnail(person.displayAvatarURL());

            if (channel?.isTextBased()) {
                await channel.send({embeds: [embed]});
            }
        }
    }
}
