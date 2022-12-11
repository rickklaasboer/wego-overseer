import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:KarmaRemoveUpvoteEvent');

export const KarmaRemoveUpvoteEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    enabled: false,
    run: async (message) => {
        logger.debug('KarmaRemoveUpvoteEvent received');
    },
});
