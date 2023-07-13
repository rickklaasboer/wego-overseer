import 'dotenv/config';
import {getEnvString} from '@/util/environment';
import Fastify from 'fastify';
import xmlBodyParser from 'fastify-xml-body-parser';

const YOUTUBE_WEBHOOK_URL = getEnvString('YOUTUBE_WEBHOOK_URL', '');

const app = Fastify({logger: true});
app.register(xmlBodyParser, {ignoreAttributes: false});

type YoutubeCallbackPayload = {
    feed: {
        link: Array<{
            '@_rel': string;
            '@_href': string;
        }>;
        title: string;
        updated: string;
        entry: {
            id: string;
            'yt:videoId': string;
            'yt:channelId': string;
            title: string;
            link: {
                '@_rel': string;
                '@_href': string;
            };
            author: {
                name: string;
                uri: string;
            };
            published: string;
            updated: string;
        };
        '@_xmlns:yt': string;
        '@_xmlns': string;
    };
};

app.post<{Body: YoutubeCallbackPayload}>('/pubsub', async (request, reply) => {
    try {
        await fetch(YOUTUBE_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: 'Webhook',
                avatar_url: 'https://i.imgur.com/4M34hi2.png',
                content: `New video uploaded by Wego Klub!!!\n\n${request.body.feed.entry.title}\n${request.body.feed.entry.link['@_href']}`,
            }),
        });

        return reply
            .code(200)
            .headers({'Content-Type': 'application/json'})
            .send({success: true, message: 'ok'});
    } catch (err) {
        return reply
            .code(400)
            .headers({'Content-Type': 'application/json'})
            .send({success: false, message: 'error'});
    }
});

export {app};
