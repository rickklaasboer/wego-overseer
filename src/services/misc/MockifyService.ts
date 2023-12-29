import {injectable} from 'inversify';

@injectable()
export default class MockifyService {
    /**
     * Mockify a sentence
     */
    public mockify(input: string): string {
        return Array.from(input)
            .map((c: string) =>
                Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase(),
            )
            .join('');
    }
}
