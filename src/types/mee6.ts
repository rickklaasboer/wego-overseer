export type Mee6Leaderboard = {
    page: number;
    guild: {
        id: string;
        icon: string;
        name: string;
        premium: boolean;
        allow_join: boolean;
        leaderboard_url: string;
        invite_leaderboard: boolean;
        commands_prefix: unknown;
        application_commands_enabled: boolean;
    };
    xp_rate: number;
    xp_per_message: Array<number>;
    role_rewards: Array<{
        rank: number;
        role: {
            color: number;
            hoist: boolean;
            icon: string;
            id: string;
            managed: boolean;
            mentionable: boolean;
            name: string;
            permissions: number;
            position: number;
            unicode_emoji: string;
        };
    }>;
    monetize_options: {
        display_plans: boolean;
        showcase_subscribers: boolean;
    };
    players: Array<{
        avatar?: string;
        discriminator: string;
        guild_id: string;
        id: string;
        message_count: number;
        monetize_xp_boost: number;
        username: string;
        xp: number;
        is_monetize_subscriber: boolean;
        detailed_xp: Array<number>;
        level: number;
    }>;
    player: {
        avatar: string;
        discriminator: string;
        guild_id: string;
        id: string;
        message_count: number;
        monetize_xp_boost: number;
        username: string;
        xp: number;
        is_monetize_subscriber: boolean;
        detailed_xp: Array<number>;
        level: number;
        rank: number;
    };
    banner_url: string;
    is_member: boolean;
    admin: boolean;
    user_guild_settings: {
        guild_id: string;
        use_default_rank_card: boolean;
        user_id: string;
    };
    country: string;
};
