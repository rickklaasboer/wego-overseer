// <feed xmlns:yt="http://www.youtube.com/xml/schemas/2015"
//          xmlns="http://www.w3.org/2005/Atom">
//   <link rel="hub" href="https://pubsubhubbub.appspot.com"/>
//   <link rel="self" href="https://www.youtube.com/xml/feeds/videos.xml?channel_id=CHANNEL_ID"/>
//   <title>YouTube video feed</title>
//   <updated>2015-04-01T19:05:24.552394234+00:00</updated>
//   <entry>
//     <id>yt:video:VIDEO_ID</id>
//     <yt:videoId>VIDEO_ID</yt:videoId>
//     <yt:channelId>CHANNEL_ID</yt:channelId>
//     <title>Video title</title>
//     <link rel="alternate" href="http://www.youtube.com/watch?v=VIDEO_ID"/>
//     <author>
//      <name>Channel title</name>
//      <uri>http://www.youtube.com/channel/CHANNEL_ID</uri>
//     </author>
//     <published>2015-03-06T21:40:57+00:00</published>
//     <updated>2015-03-09T19:05:24.552394234+00:00</updated>
//   </entry>
// </feed>

import {getEnvString} from '@/util/environment';
import 'dotenv/config';
import Fastify from 'fastify';
import {parseString} from 'xml2js';

const YOUTUBE_WEBHOOK_URL = getEnvString('YOUTUBE_WEBHOOK_URL', '');

const app = Fastify({logger: true});
app.register(require('fastify-xml-body-parser'), {ignoreAttributes: false});

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

app.post<{Body: YoutubeCallbackPayload; Reply: void}>(
    '/pubsub',
    async (request, reply) => {
        // console.log('je moeder');
        // const parsed = parseString
        // console.log(JSON.stringify(request.body));
        // console.log(YOUTUBE_WEBHOOK_URL);
        const response = await fetch(YOUTUBE_WEBHOOK_URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                username: 'Webhook',
                avatar_url: 'https://i.imgur.com/4M34hi2.png',
                content: `New video uploaded by Wego Klub!!!\n\n${request.body.feed.entry.title}\n${request.body.feed.entry.link['@_href']}`,
            }),
        });
        // console.log(await response.json());
    },
);

export {app};
