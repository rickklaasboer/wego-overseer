import 'reflect-metadata';
import 'dotenv/config';
import {container} from 'tsyringe';
import Bot from '@/Bot';

const bot = container.resolve<Bot>(Bot);

bot.start()
    .then(() => console.log('Bot running'))
    .catch(console.error);
