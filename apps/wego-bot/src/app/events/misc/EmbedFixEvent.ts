import {containsUrl} from '@/util/misc/misc';
import extractUrls from 'extract-urls';
import extractDomain from 'extract-domain';
import {trans} from '@/util/localization/localization';
import BaseEvent from '@/app/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class EmbedFixEvent implements BaseEvent<'messageCreate'> {
    public name = 'EmbedFixEvent';
    public event = 'messageCreate' as const;
    private fixable = new Map([
        ['instagram', 'ddinstagram'],
        ['reddit', 'rxddit'],
        ['tiktok', 'vxtiktok'],
        ['twitter', 'fxtwitter'],
    ]);

    constructor(private logger: Logger) {}

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>) {
        try {
            // Terminate if user is a bot
            if (message.author.bot) return;

            // Terminate if doesnt contain URL
            if (!containsUrl(message.content)) return;

            const [link] = extractUrls(message.content);
            const {hostname} = new URL(link);
            const [domain] = extractDomain(hostname, {tld: true}).split('.');

            // Terminate if domain is not fixable
            if (!this.fixable.has(domain)) return;

            const replaced = link.replace(
                domain,
                this.fixable.get(domain) ?? domain,
            );

            const thread = await message.startThread({
                name: `Embed Fix for ${domain}`,
            });

            await thread.send(trans('events.fix_embed.msg', replaced));
            await thread.setLocked(true);
            await thread.setArchived(true);
        } catch (err) {
            this.logger.fatal('Failed to run EmbedFixEvent', err);
        }
    }
}
