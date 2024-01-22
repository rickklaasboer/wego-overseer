// All credit goes to Mark Farnum for the original implementation of this algorithm
// @see https://github.com/farkmarnum/emojify
// @see https://emojify.net/
import EMOJI_DATA from '@/lib/emojify/data/emoji.json';

type EmojifyOptions = {
    density?: number;
    shouldFilterEmojis?: boolean;
};

const commonWords = new Set([
    'a',
    'an',
    'as',
    'is',
    'if',
    'of',
    'the',
    'it',
    'its',
    'or',
    'are',
    'this',
    'with',
    'so',
    'to',
    'at',
    'was',
    'and',
]);

const inappropriateEmojis = [
    '🍆',
    '💦',
    '🍑',
    '🌮',
    '👅',
    '🐍',
    '🔯',
    '🖕',
    '🚬',
    '💣',
    '🔫',
    '🔪',
    '💊',
    '💉',
];

/**
 * Check if a string contains an inappropriate emoji
 */
function isInappropriate(str: string): boolean {
    return inappropriateEmojis.some((emoji) => str.includes(emoji));
}

export default class Emojifier {
    private density: number;
    private shouldFilterEmojis: boolean;

    constructor({density = 100, shouldFilterEmojis = true}: EmojifyOptions) {
        this.density = density;
        this.shouldFilterEmojis = shouldFilterEmojis;
    }

    /**
     * Emojify a string
     */
    public emojify(input: string): string {
        const words = input.replace(/\n/g, ' ').split(' ');
        const result = words
            .reduce((acc: string, wordRaw: string) => {
                const word = wordRaw.replace(/[^0-9a-zA-Z]/g, '').toLowerCase();

                const accNext = `${acc} ${wordRaw}`;

                const randomChoice = Math.random() * 100 <= this.density;
                const isTooCommon = commonWords.has(word);

                const emojiFilter = this.shouldFilterEmojis
                    ? (option: string) => !isInappropriate(option)
                    : () => true;

                const emojiOptions = Object.entries(
                    EMOJI_DATA[word as keyof typeof EMOJI_DATA] || {},
                )
                    .filter(([option]) => emojiFilter(option))
                    .reduce(
                        (arr, [option, frequency]) => [
                            ...arr,
                            ...[...Array(frequency)].fill(option),
                        ],
                        [] as string[],
                    );

                if (isTooCommon || !randomChoice || emojiOptions.length === 0) {
                    return accNext;
                }

                const emojis =
                    emojiOptions[
                        Math.floor(Math.random() * emojiOptions.length)
                    ];

                return `${accNext} ${emojis}`;
            }, '')
            .trim();

        return result;
    }
}
