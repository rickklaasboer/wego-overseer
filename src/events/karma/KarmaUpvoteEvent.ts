import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaUpvoteEvent');

export const KarmaUpvoteEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    enabled: false,
    run: async (message) => {
        logger.debug('KarmaUpvoteEvent received');
    },
});
