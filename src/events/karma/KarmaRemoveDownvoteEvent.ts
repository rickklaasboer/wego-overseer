import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaRemoveDownvoteEvent');

export const KarmaRemoveDownvoteEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    enabled: false,
    run: async (message) => {
        logger.debug('KarmaRemoveDownvoteEvent received');
    },
});
