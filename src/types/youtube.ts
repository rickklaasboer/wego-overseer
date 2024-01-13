export type YoutubeSQSPayload = {
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
