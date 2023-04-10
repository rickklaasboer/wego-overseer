import Command from '@/commands/Command';
import crypto from 'crypto';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';

const logger = new Logger('wego-overseer:LightshotCommand');

export const LightshotCommand = new Command({
    name: 'lightshot',
    description: 'Get a random lightshot URL',
    run: async (interaction) => {
        try {
            const random = crypto.randomBytes(20).toString('hex').slice(0, 6);
            await interaction.reply(`https://prnt.sc/${random}`);
        } catch (err) {
            await interaction.followUp({
                content: trans('errors.common.failed', 'lightshot'),
                ephemeral: true,
            });
            logger.fatal('Unable to handle PollCommand', err);
        }
    },
});
