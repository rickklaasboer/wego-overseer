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
