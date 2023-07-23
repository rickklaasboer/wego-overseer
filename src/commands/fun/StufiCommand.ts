import Command from '@/commands/Command';
import Logger from '@/telemetry/logger';
import {getEnvString} from '@/util/environment';
import dayjs from 'dayjs';

const logger = new Logger('wego-overseer:commands:KortebroekCommand');

const DUO_STUFI_API_URL = getEnvString('DUO_STUFI_API_URL', '');

export type DuoApiResponse = {
    data: {
        paid_in: number;
        paid_in_unit: string;
        paid_in_date: string;
    };
    error: any;
    meta: {
        app: string;
        message: string;
        code: number;
    };
};

export const StufiCommand = new Command({
    name: 'wanneerstufi',
    description: 'Wanneer weer gratis geld van ome DUO?',
    run: async (interaction) => {
        try {
            const request = await fetch(`${DUO_STUFI_API_URL}/stufi`);
            const {data} = (await request.json()) as DuoApiResponse;

            await interaction.reply(
                `Studiefinanciering wordt over ${
                    data.paid_in
                } dagen uitbetaald. Dat is op ${dayjs(data.paid_in_date).format(
                    'D-M-YYYY',
                )}.`,
            );
        } catch (err) {
            logger.fatal(err);
        }
    },
});
