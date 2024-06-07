import Logger from '@wego/logger';
import {
    ReceiveMessageCommand,
    DeleteMessageCommand,
    ReceiveMessageCommandOutput,
} from '@aws-sdk/client-sqs';
import {YoutubeSQSPayload} from '@/types/youtube';
import {trans} from '@/util/localization/localization';
import StringBuilder from '@/util/formatting/StringBuilder';
import markdown from '@/util/formatting/markdown';
import BaseJob from '@/app/jobs/BaseJob';
import DiscordClientService from '@/app/services/discord/DiscordClientService';
import {injectable} from 'tsyringe';
import config from '@/config';
import SQSService from '@/app/services/aws/SQSService';

@injectable()
export default class YouTubeSQSPollJob implements BaseJob {
    public name = 'YouTubeSQSPollJob';
    public schedule = '* * * * *';

    constructor(
        private clientService: DiscordClientService,
        private sqsService: SQSService,
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
        const sqs = this.sqsService.getSqsClient();
        const receiveCmd = new ReceiveMessageCommand({
            QueueUrl: config.youtube.sqsQueueUrl,
            MaxNumberOfMessages: 10,
        });

        return await sqs.send(receiveCmd);
    }

    /**
     * Delete the message from the SQS queue
     */
    private async deleteMessage(
        receiptHandle: string | undefined,
    ): Promise<void> {
        const sqs = this.sqsService.getSqsClient();
        const deleteCmd = new DeleteMessageCommand({
            QueueUrl: config.youtube.sqsQueueUrl,
            ReceiptHandle: receiptHandle,
        });

        await sqs.send(deleteCmd);
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
