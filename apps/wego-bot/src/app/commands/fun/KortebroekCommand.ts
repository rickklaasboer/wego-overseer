import {EmbedBuilder} from 'discord.js';
import dayjs from 'dayjs';
import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';
import config from '@/config';
import Logger from '@wego/logger';

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
    error: unknown;
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

    constructor(private logger: Logger) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const request = await fetch(
                `${config.kanIkEenKorteBroekAan.apiUrl}/cani`,
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
            this.logger.fatal('Failed to get kan ik een korte broek aan', err);
        }
    }
}
