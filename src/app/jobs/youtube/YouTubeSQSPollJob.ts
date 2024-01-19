import Logger from '@/telemetry/logger';
import CronJob from '@/util/CronJob';
import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
    ReceiveMessageCommandOutput,
} from '@aws-sdk/client-sqs';
import {YoutubeSQSPayload} from '@/types/youtube';
import {trans} from '@/util/localization';
import StringBuilder from '@/util/StringBuilder';
import markdown from '@/util/markdown';
import BaseJob from '@/app/jobs/BaseJob';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import {injectable} from 'tsyringe';
import config from '@/config';

@injectable()
export default class YouTubeSQSPollJob implements BaseJob {
    public name = 'YouTubeSQSPollJob';
    public job = new CronJob({
        cronTime: '* * * * *',
        timeZone: 'Europe/Amsterdam',
    });
    private sqs = new SQSClient({
        region: 'eu-west-1',
        credentials: {
            accessKeyId: config.aws.accessKeyId,
            secretAccessKey: config.aws.secretAccessKey,
        },
    });

    constructor(
        private clientService: DiscordClientService,
        private logger: Logger,
    ) {}

    /**
     * Run the job
     */
    public async execute(): Promise<void> {
        try {
            const client = this.clientService.getClient();
            const messages = await this.getMessages();

            if (!messages.Messages?.length) {
                return;
            }

            const channel = await client.channels.fetch(
                config.youtube.announceChannelId,
            );

            for (const message of messages.Messages) {
                const body: YoutubeSQSPayload = JSON.parse(
                    message.Body ?? '{}',
                );

                if (!channel?.isTextBased()) {
                    this.logger.error(
                        'Failed to find channel or channel is not text based',
                    );
                    return;
                }

                await channel.send(this.buildMessage(body));
                await this.deleteMessage(message.ReceiptHandle);

                this.logger.info('Received message from YouTube SQS', body);
            }
        } catch (err) {
            this.logger.fatal('Failed to run YouTubeSQSPollJob', err);
        }
    }

    /**
     * Get the messages from the SQS queue
     */
    private async getMessages(): Promise<ReceiveMessageCommandOutput> {
        const receiveCmd = new ReceiveMessageCommand({
            QueueUrl: config.youtube.sqsQueueUrl,
            MaxNumberOfMessages: 10,
        });

        return await this.sqs.send(receiveCmd);
    }

    /**
     * Delete the message from the SQS queue
     */
    private async deleteMessage(
        receiptHandle: string | undefined,
    ): Promise<void> {
        const deleteCmd = new DeleteMessageCommand({
            QueueUrl: config.youtube.sqsQueueUrl,
            ReceiptHandle: receiptHandle,
        });

        await this.sqs.send(deleteCmd);
    }

    /**
     * Build the message
     */
    private buildMessage(body: YoutubeSQSPayload): string {
        const sb = new StringBuilder();

        sb.append(
            markdown.header(
                trans(
                    'jobs.youtube.embed.title',
                    body.feed.entry.author.name,
                    body.feed.entry.title,
                ),
            ),
        );
        sb.append('\n');
        sb.append(
            markdown.italics(
                trans(
                    'jobs.youtube.embed.description',
                    body.feed.entry.author.name,
                    body.feed.entry.link['@_href'],
                ),
            ),
        );

        return sb.toString();
    }
}
