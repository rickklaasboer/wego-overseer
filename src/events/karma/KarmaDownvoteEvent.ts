import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaDownvoteEvent');

export const KarmaDownvoteEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    enabled: false,
    run: async (message) => {
        logger.debug('KarmaDownvoteEvent received');
    },
});
