import Command from '@/commands/Command';
import {ensureChannelIsAvailable} from './KarmaCommand/predicates';

export const KarmaChannelResetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        await ensureChannelIsAvailable(interaction.channel?.id);

        // TODO: implement
    },
});
