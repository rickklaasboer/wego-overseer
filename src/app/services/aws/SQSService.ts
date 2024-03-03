import config from '@/config';
import {SQSClient} from '@aws-sdk/client-sqs';
import {singleton} from 'tsyringe';

@singleton()
export default class SQSService {
    private sqs: SQSClient;

    constructor() {
        this.sqs = new SQSClient({
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
    public getSqsClient(): SQSClient {
        return this.sqs;
    }
}
