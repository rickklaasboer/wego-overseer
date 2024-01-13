import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import {getEnvString} from '@/util/environment';
import dayjs from 'dayjs';
import {injectable} from 'tsyringe';

const API_URL = getEnvString('DUO_STUFI_API_URL', '');

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

@injectable()
export default class StufiCommand implements BaseCommand {
    name = 'wanneerstufi';
    description = 'Wanneer weer gratis geld van ome DUO?';

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(`${API_URL}/stufi`);
            const {data} = (await request.json()) as DuoApiResponse;

            await interaction.reply(
                `Studiefinanciering wordt over ${
                    data.paid_in
                } dagen uitbetaald. Dat is op ${dayjs(data.paid_in_date).format(
                    'D-M-YYYY',
                )}.`,
            );
        } catch (err) {
            console.error(err);
        }
    }
}
