import {EmbedBuilder} from 'discord.js';
import Command from '@/commands/Command';
import fetch from 'node-fetch';
import {JSDOM} from 'jsdom';

export const KortebroekCommand = new Command({
    name: 'kanikeenkortebroekaan',
    description: 'Kan ik een korte broek aan?',
    run: async (interaction) => {
        // Get response body from kanikeenkortebroekaan.nl
        const request = await fetch('https://www.kanikeenkortebroekaan.nl/');
        const response = await request.text();

        // Create a fake DOM from this response
        const dom = new JSDOM(response);
        const document = dom.window.document;
        const {src} = document.getElementsByClassName('main-image')[0]
            .children[0] as HTMLImageElement;

        // Get date, image and weather forcast from this DOM
        const date = (
            document.getElementsByClassName('date')[0] as HTMLDivElement
        )?.innerHTML;
        const tempContainer = document.getElementsByClassName(
            'temp',
        )[0] as HTMLDivElement;
        const temp = (tempContainer.children[0] as HTMLParagraphElement)
            .innerHTML;
        const rain = (tempContainer.children[1] as HTMLParagraphElement)
            .innerHTML;

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setImage('https://www.kanikeenkortebroekaan.nl' + src)
                    .setTitle('Kan ik een korte broek aan?')
                    .setDescription(`${date}\n- ${temp}\n- ${rain}`.trim()),
            ],
        });
    },
});
