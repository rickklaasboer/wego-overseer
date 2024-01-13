import {AttachmentBuilder} from 'discord.js';
import type Jimp from 'jimp';

/**
 * Wrapper class for jimp image that parses the image to base64 automagically
 * Also allows creating buffer/discord attachment from generated string
 */
export class Base64JimpImage {
    private base64String: string;

    constructor(img: Jimp) {
        this.base64String = '';

        img.getBase64('image/jpeg', (err, data) => {
            if (err) {
                throw err;
            } else {
                this.base64String = data;
            }
        });
    }

    /**
     * Create buffer from base64 string
     */
    public toBuffer(): Buffer {
        return Buffer.from(this.base64String.split(',')[1], 'base64');
    }

    /**
     * Create attachment from buffer
     */
    public toAttachment(): AttachmentBuilder {
        return new AttachmentBuilder(this.toBuffer(), {
            name: 'unknown.jpg',
        });
    }

    /**
     * Get the generated base64 string
     * NOTE: currently not used
     */
    public getBase64String() {
        return this.base64String;
    }
}
