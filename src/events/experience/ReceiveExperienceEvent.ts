import Logger from '@/telemetry/logger';
import Event from '@/events/Event';
import {
    ensureGuildIsAvailable,
    ensureUserIsAvailable,
} from '@/commands/karma/KarmaCommand/predicates';
import dayjs from 'dayjs';
import {toMysqlDateTime} from '@/util/mysql';
import Experience from '@/entities/Experience';
import {randomInt} from 'crypto';

const logger = new Logger('wego-overseer:events:ReceiveExperienceEvent');

// level = 0.07 * √XP
// xp = (level/0.07)^2

export const ReceiveExperienceEvent = new Event({
    name: 'messageCreate',
    run: async ({db}, message) => {
        try {
            if (message.author.bot) return;

            await ensureGuildIsAvailable(message.guild?.id);
            await ensureUserIsAvailable(message.author.id);

            const now = dayjs();

            // prettier-ignore
            const xp = await db.table('experience').whereBetween('createdAt', [
                toMysqlDateTime(now.subtract(30, 'seconds').toDate()),
                toMysqlDateTime(now.toDate()),
            ]).first();

            if (xp) {
                logger.debug(
                    'User has already received experience in the last 30 seconds',
                );
                return;
            }

            await Experience.query().insert({
                amount: randomInt(5, 15),
                guildId: message.guild?.id,
                userId: message.author?.id,
            });
        } catch (err) {
            logger.error('Unable to handle ReceiveExperienceEvent', err);
        }
    },
});
