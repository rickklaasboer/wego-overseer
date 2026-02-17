// Base types for common image format patterns
type BaseImageFormat = {
    height: string;
    width: string;
    size: string;
    url: string;
};

type MinimalImageFormat = {
    height: string;
    width: string;
    url: string;
};

type Mp4Format = {
    height: string;
    width: string;
    mp4: string;
    mp4_size: string;
};

type WebpImageFormat = BaseImageFormat & {
    webp: string;
    webp_size: string;
};

type AnimatedImageFormat = BaseImageFormat & {
    mp4: string;
    mp4_size: string;
    webp: string;
    webp_size: string;
};

type Looping = {
    mp4: string;
    mp4_size: string;
};

type Original = BaseImageFormat & {
    frames: string;
    hash: string;
    mp4: string;
    mp4_size: string;
    webp: string;
    webp_size: string;
};

type Images = {
    fixed_width_still: BaseImageFormat;
    preview_gif: BaseImageFormat;
    fixed_height_downsampled: WebpImageFormat;
    preview: Mp4Format;
    fixed_height_small: AnimatedImageFormat;
    downsized: BaseImageFormat;
    fixed_width_downsampled: WebpImageFormat;
    fixed_width: AnimatedImageFormat;
    downsized_still: BaseImageFormat;
    downsized_medium: BaseImageFormat;
    original_mp4: Mp4Format;
    downsized_large: BaseImageFormat;
    preview_webp: BaseImageFormat;
    original: Original;
    original_still: BaseImageFormat;
    fixed_height_small_still: BaseImageFormat;
    fixed_width_small: AnimatedImageFormat;
    looping: Looping;
    downsized_small: Mp4Format;
    fixed_width_small_still: BaseImageFormat;
    fixed_height_still: BaseImageFormat;
    fixed_height: AnimatedImageFormat;
    '480w_still': MinimalImageFormat;
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
