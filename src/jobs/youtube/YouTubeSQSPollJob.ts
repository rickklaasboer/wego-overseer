import Logger from '@/telemetry/logger';
import CronJobWithDefaults from '@/util/CronJobWithDefaults';
import Job from '../Job';
import {
    SQSClient,
    ReceiveMessageCommand,
    DeleteMessageCommand,
} from '@aws-sdk/client-sqs';
import {getEnvString} from '@/util/environment';
import {YoutubeSQSPayload} from '@/types/youtube';
import {trans} from '@/util/localization';
import StringBuilder from '@/util/StringBuilder';

const AWS_ACCESS_KEY_ID = getEnvString('AWS_ACCESS_KEY_ID', '');
const AWS_SECRET_ACCESS_KEY = getEnvString('AWS_SECRET_ACCESS_KEY', '');
const YOUTUBE_SQS_QUEUE_URL = getEnvString('YOUTUBE_SQS_QUEUE_URL', '');
const YOUTUBE_ANNOUNCE_CHANNEL_ID = getEnvString(
    'YOUTUBE_ANNOUNCE_CHANNEL_ID',
    '',
);

const logger = new Logger('wego-overseer:YouTubeSQSPollJob');

const sqs = new SQSClient({
    region: 'eu-west-1',
    credentials: {
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
    },
});

export const YouTubeSQSPollJob = new Job({
    name: 'YouTubeSQSPollJob',
    job: new CronJobWithDefaults({
        // Run every minute
        cronTime: '* * * * *',
        timeZone: 'Europe/Amsterdam',
    }),
    onTick: async ({client}) => {
        try {
            const receiveCmd = new ReceiveMessageCommand({
                QueueUrl: YOUTUBE_SQS_QUEUE_URL,
                MaxNumberOfMessages: 10,
            });

            const response = await sqs.send(receiveCmd);

            if (!response.Messages?.length) {
                return;
            }

            const channel = await client.channels.fetch(
                YOUTUBE_ANNOUNCE_CHANNEL_ID,
            );

            for (const message of response.Messages) {
                const body: YoutubeSQSPayload = JSON.parse(
                    message.Body ?? '{}',
                );

                const sb = new StringBuilder();

                sb.append(
                    trans(
                        'jobs.youtube.embed.title',
                        body.feed.entry.author.name,
                        body.feed.entry.title,
                    ),
                );
                sb.append('\n');
                sb.append(
                    trans(
                        'jobs.youtube.embed.description',
                        body.feed.entry.author.name,
                        body.feed.entry.link['@_href'],
                    ),
                );

                if (!channel?.isTextBased()) {
                    logger.error(
                        'Unable to find channel or channel is not text based',
                    );
                    return;
                }

                await channel.send(sb.toString());

                const deleteCmd = new DeleteMessageCommand({
                    QueueUrl: YOUTUBE_SQS_QUEUE_URL,
                    ReceiptHandle: message.ReceiptHandle,
                });

                await sqs.send(deleteCmd);

                logger.info('Received message from YouTube SQS', body);
            }
        } catch (err) {
            logger.fatal('Unable to handle YouTubeSQSPollJob', err);
        }
    },
});
