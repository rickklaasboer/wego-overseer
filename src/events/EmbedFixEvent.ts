import Logger from '@/telemetry/logger';
import Event from '@/events/Event';
import {containsUrl} from '@/util/misc';
import extractUrls from 'extract-urls';
import extractDomain from 'extract-domain';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:EmbedFixEvent');

const FIXABLE = new Map([
    ['instagram', 'ddinstagram'],
    ['tiktok', 'vxtiktok'],
    ['twitter', 'fxtwitter'],
]);

export const EmbedFixEvent = new Event({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            // Terminate if doesnt contain URL
            if (!containsUrl(message.content)) return;

            const [link] = extractUrls(message.content);
            const {hostname} = new URL(link);
            const [domain] = extractDomain(hostname, {tld: true}).split('.');

            // Terminate if domain is not fixable
            if (!FIXABLE.has(domain)) return;

            const replaced = link.replace(
                domain,
                FIXABLE.get(domain) ?? domain,
            );

            const thread = await message.startThread({
                name: `Embed Fix for ${domain}`,
            });

            await thread.send(trans('events.fix_embed.msg', replaced));
            await thread.setLocked(true);
        } catch (err) {
            logger.fatal('Unable to handle EmbedFixEvent', err);
        }
    },
});
