/* eslint-disable @typescript-eslint/no-explicit-any */
import {I18n, TranslateOptions} from 'i18n';
import {singleton} from 'tsyringe';

@singleton()
export default class LocalizationService {
    private i18n: I18n;

    constructor() {
        this.i18n = new I18n({
            directory: __dirname + '/../lang',
            objectNotation: true,
            defaultLocale: 'en',
        });
    }

    /**
     * Translate a phrase
     */
    public t(phrase: string | TranslateOptions, ...replace: any[]): string {
        if (!this.i18n) return phrase.toString();
        return this.i18n.__(phrase, ...replace);
    }

    /**
     * Alias for t()
     */
    public trans(
        phrase: string | TranslateOptions,
        ...replace: string[]
    ): string {
        return this.t(phrase, ...replace);
    }

    /**
     * Alias for t()
     */
    public translate(
        phrase: string | TranslateOptions,
        ...replace: string[]
    ): string {
        return this.t(phrase, ...replace);
    }
}
