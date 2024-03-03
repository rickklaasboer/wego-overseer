import config from '@/config';
import {ComprehendClient} from '@aws-sdk/client-comprehend';
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
}
