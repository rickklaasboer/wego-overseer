import {containsUrl} from '@/util/misc';
import extractUrls from 'extract-urls';
import extractDomain from 'extract-domain';
import {trans} from '@/util/localization';
import BaseEvent from '@/events/BaseEvent';
import {Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class EmbedFixEvent implements BaseEvent<'messageCreate'> {
    public name = 'EmbedFixEvent';
    public event = 'messageCreate' as const;
    public enabled = true;
    private fixable = new Map([
        ['instagram', 'ddinstagram'],
        ['reddit', 'rxddit'],
        ['tiktok', 'vxtiktok'],
        ['twitter', 'fxtwitter'],
    ]);

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
            console.error('Unable to handle EmbedFixEvent', err);
        }
    }
}
