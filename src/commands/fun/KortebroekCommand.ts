import {EmbedBuilder} from 'discord.js';
import dayjs from 'dayjs';
import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';
import {injectable} from 'tsyringe';
import config from '@/config';

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
    public name = 'kanikeenkortebroekaan';
    public description = 'Kan ik een korte broek aan?';

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(
                `${config.kanIkEenKorteBroekAanApiUrl}/cani`,
            );

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
