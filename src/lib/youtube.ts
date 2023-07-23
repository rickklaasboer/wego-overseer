import Logger from '@/telemetry/logger';
import {Maybe} from '@/types/util';
import {getEnvString} from '@/util/environment';

const GOOGLE_API_KEY = getEnvString('GOOGLE_API_KEY', '');

const logger = new Logger('wego-overseer:lib:youtube');

type GetChannelResponse = {
    kind: string;
    etag: string;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
    items: Array<{
        kind: string;
        etag: string;
        id: string;
        snippet: GetChannelResponseSnippet;
    }>;
};

type GetChannelResponseSnippet = {
    title: string;
    description: string;
    customUrl: string;
    publishedAt: string;
    thumbnails: {
        default: {
            url: string;
            width: number;
            height: number;
        };
        medium: {
            url: string;
            width: number;
            height: number;
        };
        high: {
            url: string;
            width: number;
            height: number;
        };
    };
    localized: {
        title: string;
        description: string;
    };
    country: string;
};

export type GetVideosResponse = {
    kind: string;
    etag: string;
    items: Array<{
        kind: string;
        etag: string;
        id: string;
        snippet: GetVideosResponseSnippet;
    }>;
    pageInfo: {
        totalResults: number;
        resultsPerPage: number;
    };
};

type GetVideosResponseSnippet = {
    publishedAt: string;
    channelId: string;
    title: string;
    description: string;
    thumbnails: {
        default: {
            url: string;
            width: number;
            height: number;
        };
        medium: {
            url: string;
            width: number;
            height: number;
        };
        high: {
            url: string;
            width: number;
            height: number;
        };
    };
    channelTitle: string;
    categoryId: string;
    liveBroadcastContent: string;
    localized: {
        title: string;
        description: string;
    };
    defaultAudioLanguage: string;
};

/**
 * Get a channel by its ID
 */
export async function getChannel(
    channelId: string,
): Promise<Maybe<GetChannelResponseSnippet>> {
    try {
        const url = new URL('https://www.googleapis.com/youtube/v3/channels');
        url.searchParams.append('part', 'snippet');
        url.searchParams.append('id', channelId);
        url.searchParams.append('key', GOOGLE_API_KEY);

        const request = await fetch(url.toString());
        const response = (await request.json()) as GetChannelResponse;

        const item = response.items[0].snippet;

        if (!item) {
            throw new Error('No results for channel with id ' + channelId);
        }

        return item;
    } catch (err) {
        logger.error(err);
        return null;
    }
}

/**
 * Get a video by its ID
 */
export async function getVideo(
    videoId: string,
): Promise<Maybe<GetVideosResponseSnippet>> {
    try {
        const url = new URL('https://www.googleapis.com/youtube/v3/videos');
        url.searchParams.append('part', 'snippet');
        url.searchParams.append('id', videoId);
        url.searchParams.append('key', GOOGLE_API_KEY);

        const request = await fetch(url.toString());
        const response = await request.json();

        const item = response.items[0].snippet;

        if (!item) {
            throw new Error('No results for video with id ' + videoId);
        }

        return item;
    } catch (err) {
        logger.error(err);
        return null;
    }
}
