import {EmbedBuilder} from 'discord.js';
import Command from '@/commands/Command';
import {getEnvString} from '@/util/environment';
import dayjs from 'dayjs';
import Logger from '@/telemetry/logger';

const logger = new Logger('wego-overseer:commands:KortebroekCommand');

const KANIKEENKORTEBROEKAAN_API_URL = getEnvString(
    'KANIKEENKORTEBROEKAAN_API_URL',
    '',
);

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

export const KortebroekCommand = new Command({
    name: 'kanikeenkortebroekaan',
    description: 'Kan ik een korte broek aan?',
    run: async (interaction) => {
        try {
            const request = await fetch(
                `${KANIKEENKORTEBROEKAAN_API_URL}/cani`,
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
            logger.fatal(err);
        }
    },
});
