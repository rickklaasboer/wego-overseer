import config from '@/config';
import {
    ComprehendClient,
    DetectDominantLanguageCommand,
    LanguageCode,
} from '@aws-sdk/client-comprehend';
import {singleton} from 'tsyringe';

@singleton()
export default class ComprehendService {
    private comprehend: ComprehendClient;

    constructor() {
        this.comprehend = new ComprehendClient({
            region: 'eu-west-1',
            credentials: {
                accessKeyId: config.aws.accessKeyId,
                secretAccessKey: config.aws.secretAccessKey,
            },
        });
    }

    /**
     * Get the comprehend client
     */
    public getComprehendClient(): ComprehendClient {
        return this.comprehend;
    }

    /**
     * Get the dominance of a language in an input string
     */
    public async getLanguageDominance(
        input: string,
        languageCode: LanguageCode,
    ): Promise<number> {
        const {Languages} = await this.comprehend.send(
            new DetectDominantLanguageCommand({Text: input}),
        );

        return (
            Languages?.find(({LanguageCode}) => LanguageCode === languageCode)
                ?.Score ?? 0
        );
    }

    public async getDominantLanguage(input: string): Promise<LanguageCode> {
        const {Languages} = await this.comprehend.send(
            new DetectDominantLanguageCommand({Text: input}),
        );

        return (
            (Languages?.at(0)?.LanguageCode as LanguageCode) || LanguageCode.EN
        );
    }
}
