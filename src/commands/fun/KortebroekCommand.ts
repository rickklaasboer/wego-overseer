import {EmbedBuilder} from 'discord.js';
import {getEnvString} from '@/util/environment';
import dayjs from 'dayjs';
import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';

const API_URL = getEnvString('KANIKEENKORTEBROEKAAN_API_URL', '');

type KanIkEenKorteBroekAanApiResponse = {
    data: {
        app: string;
        message: string;
        can_i: boolean;
        image: string;
        temperature: string;
        chance_of_rain: string;
        record: Array<Record<string, Array<string>>>;
    };
    error: any;
    meta: {
        app: string;
        message: string;
        code: number;
    };
};

@injectable()
export default class KortebroekCommand implements BaseCommand {
    name = 'kanikeenkortebroekaan';
    description = 'Kan ik een korte broek aan?';

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(`${API_URL}/cani`);
            const {data} =
                (await request.json()) as KanIkEenKorteBroekAanApiResponse;

            await interaction.reply({
                embeds: [
                    new EmbedBuilder()
                        .setImage(data.image)
                        .setTitle('Kan ik een korte broek aan?')
                        .setDescription(
                            `- ${dayjs().format('D-M-YYYY')}\n- ${
                                data.temperature
                            }\n- ${data.chance_of_rain}`.trim(),
                        ),
                ],
            });
        } catch (err) {
            console.error(err);
        }
    }
}
