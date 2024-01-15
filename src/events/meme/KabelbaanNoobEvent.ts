import config from '@/config';
import BaseEvent from '@/events/BaseEvent';
import {GuildEmoji, Message} from 'discord.js';
import {injectable} from 'tsyringe';

@injectable()
export default class KabelbaanNoobEvent implements BaseEvent<'messageCreate'> {
    public name = 'KabelbaanNoobEvent';
    public event = 'messageCreate' as const;

    /**
     * Run the event
     */
    public async execute(message: Message<boolean>): Promise<void> {
        try {
            // Terminate if user is not kabelbaan
            if (message.author.id != config.noob.kabelkaanDiscordId) return;

            const emoji = this.getEmoji(message, config.noob.noobEmojiId);

            if (!message.content.includes(emoji.toString())) return;
            await message.react(emoji.toString());
        } catch (err) {
            console.error('Unable to handle KabelBaanNoobEvent', err);
        }
    }

    /**
     * Get emoji by id
     */
    private getEmoji(message: Message, emojiId: string): GuildEmoji {
        const emoji = message.client.emojis.cache.find(
            (emoji) => emoji.id == emojiId,
        );

        if (!emoji) {
            throw new Error(`Emoji with id ${emojiId} not found`);
        }

        return emoji;
    }
}
