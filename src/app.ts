import 'reflect-metadata';
import 'dotenv/config';
import {container} from 'tsyringe';
import {Model} from 'objection';
import Bot from '@/Bot';
import KnexService from '@/services/KnexService';
import Logger from '@/telemetry/logger';

const bot = container.resolve(Bot);
const logger = container.resolve(Logger);

// Pass the knex instance to objection
// I would've preferred to let dependency injection handle this but Objection does not support it
// So here we are
Model.knex(container.resolve(KnexService).getKnex());

bot.start().catch(logger.fatal);
