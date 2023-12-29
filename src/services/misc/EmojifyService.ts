import Emojifier from '@/lib/emojify/Emojifier';
import {injectable} from 'inversify';

@injectable()
export default class EmojifyService {
    private emojifier: Emojifier;

    constructor() {
        this.emojifier = new Emojifier({
            density: 100,
            shouldFilterEmojis: false,
        });
    }

    /**
     * Emojify a sentence
     */
    public emojify(sentence: string): string {
        return this.emojifier.emojify(sentence);
    }
}
