import fetch from 'node-fetch';

type FixedWidthStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type PreviewGif = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedHeightDownsampled = {
    height: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type Preview = {
    height: string;
    mp4: string;
    mp4_size: string;
    width: string;
};

type FixedHeightSmall = {
    height: string;
    mp4: string;
    mp4_size: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type Downsized = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedWidthDownsampled = {
    height: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type FixedWidth = {
    height: string;
    mp4: string;
    mp4_size: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type DownsizedStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type DownsizedMedium = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type OriginalMp4 = {
    height: string;
    mp4: string;
    mp4_size: string;
    width: string;
};

type DownsizedLarge = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type PreviewWebp = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type Original = {
    frames: string;
    hash: string;
    height: string;
    mp4: string;
    mp4_size: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type OriginalStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedHeightSmallStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedWidthSmall = {
    height: string;
    mp4: string;
    mp4_size: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type Looping = {
    mp4: string;
    mp4_size: string;
};

type DownsizedSmall = {
    height: string;
    mp4: string;
    mp4_size: string;
    width: string;
};

type FixedWidthSmallStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedHeightStill = {
    height: string;
    size: string;
    url: string;
    width: string;
};

type FixedHeight = {
    height: string;
    mp4: string;
    mp4_size: string;
    size: string;
    url: string;
    webp: string;
    webp_size: string;
    width: string;
};

type _480wStill = {
    url: string;
    width: string;
    height: string;
};

type Images = {
    fixed_width_still: FixedWidthStill;
    preview_gif: PreviewGif;
    fixed_height_downsampled: FixedHeightDownsampled;
    preview: Preview;
    fixed_height_small: FixedHeightSmall;
    downsized: Downsized;
    fixed_width_downsampled: FixedWidthDownsampled;
    fixed_width: FixedWidth;
    downsized_still: DownsizedStill;
    downsized_medium: DownsizedMedium;
    original_mp4: OriginalMp4;
    downsized_large: DownsizedLarge;
    preview_webp: PreviewWebp;
    original: Original;
    original_still: OriginalStill;
    fixed_height_small_still: FixedHeightSmallStill;
    fixed_width_small: FixedWidthSmall;
    looping: Looping;
    downsized_small: DownsizedSmall;
    fixed_width_small_still: FixedWidthSmallStill;
    fixed_height_still: FixedHeightStill;
    fixed_height: FixedHeight;
    '480w_still': _480wStill;
};

type User = {
    avatar_url: string;
    banner_image: string;
    banner_url: string;
    profile_url: string;
    username: string;
    display_name: string;
    description: string;
    is_verified: boolean;
    website_url: string;
    instagram_url: string;
};

type Data = {
    type: string;
    id: string;
    url: string;
    slug: string;
    bitly_gif_url: string;
    bitly_url: string;
    embed_url: string;
    username: string;
    source: string;
    title: string;
    rating: string;
    content_url: string;
    source_tld: string;
    source_post_url: string;
    is_sticker: number;
    import_datetime: string;
    trending_datetime: string;
    images: Images;
    user: User;
};

type Meta = {
    msg: string;
    status: number;
    response_id: string;
};

type GiphyRandomResponse = {
    data: Data;
    meta: Meta;
};

export async function getRandomGiphyGif({
    api_key,
    tag,
}: {
    api_key: string;
    tag?: string;
}): Promise<GiphyRandomResponse> {
    const url = new URL('https://api.giphy.com/v1/stickers/random');
    url.search = new URLSearchParams({
        api_key,
        ...(tag ? {tag} : null),
    }).toString();

    const request = await fetch(url.toString());
    const response = (await request.json()) as GiphyRandomResponse;

    return response;
}
