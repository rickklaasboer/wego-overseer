import {injectable} from 'inversify';
import Uwuifier from 'uwuifier';

@injectable()
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
