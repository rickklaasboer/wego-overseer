import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:KabelBaanNoobEvent');
const kabelbaanDiscordId = '162624307745390592';
const noobEmojiId = '375338339248898048';

export const KabelbaanNoobEvent = new Event<'messageCreate'>({
    name: 'messageCreate',
    run: async (_, message) => {
        try {
            // Terminate if user is not kabelbaan
            if (message.author.id != kabelbaanDiscordId) return;

            //<:noob:375338339248898048> | <:name:id>
            const noobEmoji = message.client.emojis.cache.find(
                (emoji) => emoji.id == noobEmojiId,
            );

            if (!noobEmoji) {
                logger.error('Noob emoji not found');
                return;
            }

            if (message.content.includes(noobEmoji.toString())) {
                await message.react(noobEmoji.toString());
            }
        } catch (err) {
            logger.error('Unable to handle KabelBaanNoobEvent', err);
        }
    },
});
