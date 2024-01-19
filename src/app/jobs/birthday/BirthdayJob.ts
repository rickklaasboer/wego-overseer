import Logger from '@/telemetry/logger';
import CronJob from '@/util/CronJob';
import {trans} from '@/util/localization';
import {EmbedBuilder, User} from 'discord.js';
import BaseJob from '@/app/jobs/BaseJob';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import {injectable} from 'tsyringe';
import UserRepository from '@/app/repositories/UserRepository';

@injectable()
export default class BirthdayJob implements BaseJob {
    public name = 'BirthdayJob';
    public job = new CronJob({
        cronTime: '0 12 * * *',
        timeZone: 'Europe/Amsterdam',
    });

    constructor(
        private clientService: DiscordClientService,
        private userRepository: UserRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the job
     */
    public async execute(): Promise<void> {
        try {
            const client = this.clientService.getClient();
            const users = await this.userRepository.getAllWithGuilds();

            for (const user of users) {
                for (const guild of user.guilds) {
                    const channel = await client.channels.fetch(
                        guild.birthdayChannelId,
                    );

                    const person = await client.users.fetch(user.id);

                    const discordGuild = await client.guilds.fetch(guild.id);
                    const discordGuildMember = await discordGuild.members.fetch(
                        person.id,
                    );

                    if (!discordGuildMember) {
                        this.logger.warn(
                            `Failed to find ${person.username} in ${discordGuild.name}, skipping...`,
                        );
                        return;
                    }

                    const embed = this.getEmbed(person);

                    if (channel?.isTextBased()) {
                        await channel.send({embeds: [embed]});
                    }
                }
            }
        } catch (err) {
            this.logger.fatal('Failed to run BirthdayJob', err);
        }
    }

    /**
     * Get the embed for the birthday
     */
    private getEmbed(user: User): EmbedBuilder {
        return new EmbedBuilder()
            .setTitle(trans('jobs.birthday.embed.title', user.username))
            .setDescription(trans('jobs.birthday.embed.description', user.id))
            .setThumbnail(user.displayAvatarURL());
    }
}
