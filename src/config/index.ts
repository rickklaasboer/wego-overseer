import app from '@/config/app';
import database from '@/config/database';
import redis from '@/config/redis';
import discord from '@/config/discord';
import misc from '@/config/misc';

export default {
    app,
    database,
    discord,
    redis,
    ...misc,
};
