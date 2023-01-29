import {EmbedBuilder} from 'discord.js';
import Command from '@/commands/Command';
import {getRandomGiphyGif} from '@/lib/giphy';
import {trans} from '@/util/localization';

const {GIPHY_API_KEY} = process.env;

export const SpooktoberCommand = new Command({
    name: 'spooktober',
    description: 'Displays a random halloween-themed GIF',
    run: async (interaction) => {
        // 9 is October because starts at 0
        if (new Date().getMonth() !== 9) {
            interaction.reply(
                trans('commands.spooktober.time_of_year_incorrect'),
            );
            return;
        }

        const response = await getRandomGiphyGif({
            api_key: GIPHY_API_KEY ?? '',
            tag: 'halloween',
        });

        const imageEmbed = new EmbedBuilder()
            .setTitle(response.data.title)
            .setImage(response.data.images.original.url)
            .setFooter({text: 'Powered by GIPHY'});

        await interaction.reply({
            embeds: [imageEmbed],
        });
    },
});
