import 'dotenv/config';
import Bot from './Bot';
import {KortebroekCommand} from './commands/KortebroekCommand';
import {PingCommand} from './commands/PingCommand';
import {StufiCommand} from './commands/StufiCommand';

const DISCORD_APPLICATION_ID = process.env.DISCORD_APPLICATION_ID ?? '';
const DISCORD_TOKEN = process.env.DISCORD_TOKEN ?? '';

(async () => {
    const bot = new Bot({
        applicationId: DISCORD_APPLICATION_ID,
        token: DISCORD_TOKEN,
        commands: [PingCommand, KortebroekCommand, StufiCommand],
    });

    // Let's keep this on one line
    // prettier-ignore
    await bot.boot().then(() => console.log('ready')).catch(console.error);
})();
