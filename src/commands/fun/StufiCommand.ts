import Command from '@/commands/Command';
import fetch from 'node-fetch';
import dayjs from 'dayjs';
import {JSDOM} from 'jsdom';

export const StufiCommand = new Command({
    name: 'wanneerstufi',
    description: 'Wanneer weer gratis geld van ome DUO?',
    run: async (interaction) => {
        // Get response body from duo.nl
        const request = await fetch('https://duo.nl/particulier/');
        const webpage = await request.text();

        // Build a fake DOM from this response
        const dom = new JSDOM(webpage);
        const document = dom.window.document;

        // Get payout date from DOM
        const text = (
            (document.getElementsByClassName('hint')[0] as HTMLDivElement)
                .children[0] as HTMLParagraphElement
        ).innerHTML;

        // Remove unwanted HTML tags (as JSDOM doesn't support innerText)
        const parsed = text.replace(/(<([^>]+)>)/gi, '');
        const days = parseInt(parsed.replace(/\D/g, ''));

        // Get future date (from x amount of days)
        const future = dayjs().add(days, 'days');

        await interaction.reply(
            isNaN(days)
                ? parsed
                : `${parsed}. Dat is op ${future.format('D-M-YYYY')}.`,
        );
    },
});
