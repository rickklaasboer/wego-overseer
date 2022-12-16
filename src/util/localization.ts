import {Maybe} from '@/types/util';
import {I18n} from 'i18n';

let instance: Maybe<I18n> = null;

/**
 * Set localization instance
 */
export function setLocalizationInstance(obj: I18n): void {
    instance = obj;
}

export function t(phrase: string, ...replace: string[]): string {
    if (!instance) return phrase;
    return instance.__(phrase, ...replace);
}

export function trans(phrase: string, ...replace: string[]): string {
    return t(phrase, ...replace);
}

export function translate(phrase: string, ...replace: string[]): string {
    return t(phrase, ...replace);
}
