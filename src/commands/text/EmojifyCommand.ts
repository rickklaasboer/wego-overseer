/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Emojifier from '@/lib/emojify/Emojifier';
import {trans} from '@/util/localization';

const emojify = new Emojifier({
    density: 100,
    shouldFilterEmojis: false,
});

export const EmojifyCommand = new Command({
    name: 'emojify',
    description: 'Emojify a sentence',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'The sentence to emojify',
            required: true,
            min_length: 1,
        },
    ],
    run: async (interaction) => {
        try {
            await interaction.reply(
                emojify.emojify(interaction.options.getString('sentence')!),
            );
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: trans('errors.common.failed', 'emojify'),
                ephemeral: true,
            });
        }
    },
});
