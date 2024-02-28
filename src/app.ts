import 'reflect-metadata';
import 'dotenv/config';
import {Model} from 'objection';
import Bot from '@/Bot';
import KnexService from '@/app/services/KnexService';
import {setLocalizationInstance} from '@/util/localization/localization';
import LocalizationService from '@/app/services/LocalizationService';
import {app} from '@/util/misc/misc';

const bot = app(Bot);

// Pass the knex instance to objection
// I would've preferred to let dependency injection handle this but Objection does not support it
// So here we are
Model.knex(app(KnexService).getKnex());

// Set the localization instance
setLocalizationInstance(app(LocalizationService).getI18n());

bot.start().catch(console.error);
