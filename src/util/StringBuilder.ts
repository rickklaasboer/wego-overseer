export default class StringBuilder {
    base: string;

    constructor(base = '') {
        this.base = base;
    }

    /**
     * Append to string
     */
    public append(...appendables: string[]): this {
        for (const str of appendables) {
            this.base += str;
        }

        return this;
    }

    /**
     * Prepend to string
     */
    public prepend(...prependables: string[]): this {
        let newBase = '';

        for (const str of prependables) {
            newBase += str;
        }

        this.base = newBase + this.base;

        return this;
    }

    /**
     * Create string from StringBuilder
     */
    toString(): string {
        return this.base;
    }
}
