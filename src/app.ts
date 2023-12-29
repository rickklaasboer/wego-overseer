import {Container} from 'inversify';
import EmojifyService from '@/services/misc/EmojifyService';
import MockifyService from '@/services/misc/MockifyService';
import UwuifyService from '@/services/misc/UwuifyService';
import HttpService from '@/services/requests/HttpService';
import KnexService from '@/services/KnexService';
import UserRepository from '@/repositories/UserRepository';
import GuildRepository from '@/repositories/GuildRepository';

const container = new Container({autoBindInjectable: true});

// Bind services
container.bind<KnexService>(KnexService).toSelf().inSingletonScope();
container.bind<HttpService>(HttpService).toSelf().inSingletonScope();

container.bind<EmojifyService>(EmojifyService).toSelf().inSingletonScope();
container.bind<MockifyService>(MockifyService).toSelf().inSingletonScope();
container.bind<UwuifyService>(UwuifyService).toSelf().inSingletonScope();

// Bind repositories
container.bind<UserRepository>(UserRepository).toSelf();
container.bind<GuildRepository>(GuildRepository).toSelf();
