import {Maybe} from '@/types/util';

export function getEnvString(key: string): Maybe<string>;
export function getEnvString(key: string, fallback: string): string;
export function getEnvString(key: string, fallback?: string): Maybe<string> {
    return process.env[key] ?? fallback;
}

export function getEnvInt(key: string): Maybe<number>;
export function getEnvInt(key: string, fallback: number): number;
export function getEnvInt(key: string, fallback?: number): Maybe<number> {
    const value = parseInt(String(process.env[key]));
    return Number.isFinite(value) ? value : fallback;
}

export function getEnvBool(key: string): Maybe<boolean>;
export function getEnvBool(key: string, fallback: boolean): boolean;
export function getEnvBool(key: string, fallback?: boolean): Maybe<boolean> {
    const value = String(process.env[key]).trim();

    if (/^(?:y|yes|true|1|on)$/i.test(value)) {
        return true;
    }

    if (/^(?:n|no|false|0|off)$/i.test(value)) {
        return false;
    }

    return fallback;
}
