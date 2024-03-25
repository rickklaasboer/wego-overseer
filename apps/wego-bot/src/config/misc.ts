import {getEnvBool, getEnvInt, getEnvString} from '@/util/misc/environment';

export default {
    giphy: {
        apiKey: getEnvString('GIPHY_API_KEY', ''),
    },
    qualityContent: {
        emojiName: getEnvString('QCC_EMOJI_NAME', 'upvote'),
        minEmojiCount: getEnvInt('QCC_MIN_EMOJI_COUNT', 5),
        channelId: getEnvString('QCC_CHANNEL_ID', ''),
    },
    trashContent: {
        emojiName: getEnvString('TCC_EMOJI_NAME', 'downvote'),
        minEmojiCount: getEnvInt('TCC_MIN_EMOJI_COUNT', 5),
        channelId: getEnvString('TCC_CHANNEL_ID', ''),
    },
    adventOfCode: {
        cookie: getEnvString('AOC_SESSION_COOKIE', ''),
        leaderboardUrl: getEnvString('AOC_LEADERBOARD_URL', ''),
    },
    kanIkEenKorteBroekAan: {
        apiUrl: getEnvString('KANIKEENKORTEBROEKAAN_API_URL', ''),
    },
    duo: {
        apiUrl: getEnvString('DUO_STUFI_API_URL', ''),
    },
    aws: {
        accessKeyId: getEnvString('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: getEnvString('AWS_SECRET_ACCESS_KEY', ''),
    },
    youtube: {
        sqsQueueUrl: getEnvString('YOUTUBE_SQS_QUEUE_URL', ''),
        announceChannelId: getEnvString('YOUTUBE_ANNOUNCE_CHANNEL_ID', ''),
    },
    noob: {
        kabelkaanDiscordId: getEnvString('KABELBAAN_DISCORD_ID', ''),
        noobEmojiId: getEnvString('NOOB_EMOJI_ID', ''),
    },
    knex: {
        enableLogger: getEnvBool('ENABLE_KNEX_LOGGER', false),
    },
    karma: {
        graph: {
            width: getEnvInt('KARMA_GRAPH_WIDTH', 500),
            height: getEnvInt('KARMA_GRAPH_HEIGHT', 300),
            apiUrl: getEnvString('KARMA_GRAPH_CHART_API_URL', ''),
        },
        upvote: getEnvString('KARMA_UPVOTE_EMOJI_NAME', 'upvote'),
        downvote: getEnvString('KARMA_DOWNVOTE_EMOJI_NAME', 'downvote'),
    },
    github: {
        apiToken: getEnvString('GITHUB_API_TOKEN', ''),
        apiUrl: getEnvString('GITHUB_API_URL', ''),
    },
    heartbeat: {
        url: getEnvString('HEARTBEAT_URL', ''),
    },
};
