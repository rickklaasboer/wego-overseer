import User from '@/entities/User';
import Logger from '@/telemetry/logger';
import CronJobWithDefaults from '@/util/CronJobWithDefaults';
import {trans} from '@/util/localization';
import dayjs from 'dayjs';
import {EmbedBuilder} from 'discord.js';
import Job from '../Job';

const logger = new Logger('wego-overseer:BirthdayJob');

export const BirthdayJob = new Job({
    name: 'BirthdayJob',
    job: new CronJobWithDefaults({
        cronTime: '0 12 * * *',
        timeZone: 'Europe/Amsterdam',
    }),
    onTick: async ({client}) => {
        try {
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
                        .setTitle(
                            trans('jobs.birthday.embed.title', person.username),
                        )
                        .setDescription(
                            trans('jobs.birthday.embed.description', person.id),
                        )
                        .setThumbnail(person.displayAvatarURL());

                    if (channel?.isTextBased()) {
                        await channel.send({embeds: [embed]});
                    }
                }
            }
        } catch (err) {
            logger.fatal('Unable to handle BirthdayJob', err);
        }
    },
});
