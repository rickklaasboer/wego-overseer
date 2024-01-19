/* eslint-disable @typescript-eslint/no-explicit-any */
import {I18n} from 'i18n';
import {singleton} from 'tsyringe';

@singleton()
export default class LocalizationService {
    private i18n: I18n;

    constructor() {
        this.i18n = new I18n({
            directory: __dirname + '/../../lang',
            objectNotation: true,
            defaultLocale: 'en',
        });
    }

    /**
     * Get the i18n instance
     */
    public getI18n(): I18n {
        return this.i18n;
    }
}
