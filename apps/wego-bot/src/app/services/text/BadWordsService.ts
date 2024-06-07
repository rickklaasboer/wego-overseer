import Filter from 'bad-words';
import {singleton} from 'tsyringe';

@singleton()
export default class BadWordsService {
    private filter: Filter;

    constructor() {
        this.filter = new Filter();
    }

    /**
     * Check if a string contains bad words
     */
    public containsBadWords(str: string): boolean {
        return this.filter.isProfane(str);
    }

    /**
     * Get the bad words from a string
     */
    public getProfaneWords(str: string): string[] {
        return str.split(' ').filter((word) => this.filter.isProfane(word));
    }
}
