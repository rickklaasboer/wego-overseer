import {singleton} from 'tsyringe';
import Uwuifier from 'uwuifier';

@singleton()
export default class UwuifyService {
    private uwuifier: Uwuifier;

    constructor() {
        this.uwuifier = new Uwuifier();
    }

    /**
     * Uwuify a sentence
     */
    public uwuify(sentence: string): string {
        return this.uwuifier.uwuifySentence(sentence);
    }
}
