/* eslint-disable @typescript-eslint/no-explicit-any */
import {I18n, TranslateOptions} from 'i18n';
import {singleton} from 'tsyringe';

// We cannot use paths here, because rollup's json plugin does not seem to work with paths
import LANG_EN from '../../lang/en.json';
import LANG_NL from '../../lang/nl.json';

@singleton()
export default class LocalizationService {
    private i18n: I18n;

    constructor() {
        this.i18n = new I18n({
            objectNotation: true,
            defaultLocale: 'en',
            staticCatalog: {
                // TypeScript is wrong, so we need to cast to any
                // It do be like that sometimes
                en: LANG_EN as any,
                nl: LANG_NL as any,
            },
        });
    }

    /**
     * Get the i18n instance
     */
    public getI18n(): I18n {
        return this.i18n;
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
