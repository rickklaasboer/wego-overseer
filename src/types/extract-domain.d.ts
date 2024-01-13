declare module 'extract-domain' {
    type ExtractDomainOptions = {tld?: boolean};

    export default function extractDomain(
        url: string,
        options?: ExtractDomainOptions,
    ): string;

    export default function extractDomain(
        url: string[],
        options?: ExtractDomainOptions,
    ): string[];
}
