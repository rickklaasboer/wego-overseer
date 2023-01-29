/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import {trans} from '@/util/localization';
import Uwuifier from 'uwuifier';

const uwu = new Uwuifier();

export const UwuCommand = new Command({
    name: 'uwu',
    description: 'UwUify a sentence',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'sentence',
            description: 'The sentence to UwUify',
            required: true,
            min_length: 1,
        },
    ],
    run: async (interaction) => {
        try {
            await interaction.reply(
                uwu.uwuifySentence(interaction.options.getString('sentence')!),
            );
        } catch (err) {
            console.error(err);
            await interaction.reply({
                content: trans('errors.common.failed', 'uwu'),
                ephemeral: true,
            });
        }
    },
});
