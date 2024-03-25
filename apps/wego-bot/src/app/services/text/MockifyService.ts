import {singleton} from 'tsyringe';

@singleton()
export default class MockifyService {
    /**
     * Mockify a sentence
     */
    public mockify(sentence: string): string {
        return Array.from(sentence)
            .map((c: string) =>
                Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase(),
            )
            .join('');
    }
}
