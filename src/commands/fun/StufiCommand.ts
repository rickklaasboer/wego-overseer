import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import config from '@/config';
import Logger from '@/telemetry/logger';
import dayjs from 'dayjs';
import {injectable} from 'tsyringe';

export type DuoApiResponse = {
    data: {
        paid_in: number;
        paid_in_unit: string;
        paid_in_date: string;
    };
    error: unknown;
    meta: {
        app: string;
        message: string;
        code: number;
    };
};

@injectable()
export default class StufiCommand implements BaseCommand {
    public name = 'wanneerstufi';
    public description = 'Wanneer weer gratis geld van ome DUO?';

    constructor(private logger: Logger) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(`${config.duoStufiApiUrl}/stufi`);
            const {data} = (await request.json()) as DuoApiResponse;

            await interaction.reply(
                `Studiefinanciering wordt over ${
                    data.paid_in
                } dagen uitbetaald. Dat is op ${dayjs(data.paid_in_date).format(
                    'D-M-YYYY',
                )}.`,
            );
        } catch (err) {
            this.logger.fatal('Failed to get stufi', err);
        }
    }
}
