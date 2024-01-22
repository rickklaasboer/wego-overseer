import {AttachmentBuilder} from 'discord.js';
import type Jimp from 'jimp';

/**
 * Wrapper class for jimp image that parses the image to base64 automagically
 * Also allows creating buffer/discord attachment from generated string
 */
export class JimpImage {
    private base64: string;

    constructor(img: Jimp) {
        this.base64 = '';

        img.getBase64('image/jpeg', (err, data) => {
            if (err) {
                throw err;
            } else {
                this.base64 = data;
            }
        });
    }

    /**
     * Create buffer from base64 string
     */
    public toBuffer(): Buffer {
        return Buffer.from(this.base64.split(',')[1], 'base64');
    }

    /**
     * Create attachment from buffer
     */
    public toAttachment(): AttachmentBuilder {
        return new AttachmentBuilder(this.toBuffer(), {
            name: 'unknown.jpg',
        });
    }
}
