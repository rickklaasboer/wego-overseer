import {Maybe} from '@/types/util';
import {I18n, TranslateOptions} from 'i18n';

let instance: Maybe<I18n> = null;

type Replaceable = string | number | boolean | null | undefined;

/**
 * Set localization instance
 */
export function setLocalizationInstance(obj: I18n): void {
    instance = obj;
}

export function t(
    phrase: string | TranslateOptions,
    ...replace: Replaceable[]
): string {
    if (!instance) return phrase.toString();
    return instance.__(phrase, ...replace.map(String));
}

export function trans(
    phrase: string | TranslateOptions,
    ...replace: Replaceable[]
): string {
    return t(phrase, ...replace);
}

export function translate(
    phrase: string | TranslateOptions,
    ...replace: Replaceable[]
): string {
    return t(phrase, ...replace);
}
