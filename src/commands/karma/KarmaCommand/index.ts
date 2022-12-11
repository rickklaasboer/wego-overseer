/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command from '@/commands/Command';
import {KarmaChannelDisableCommand} from '../KarmaChannelDisableCommand';
import {KarmaChannelEnableCommand} from '../KarmaChannelEnableCommand';
import {KarmaChannelResetCommand} from '../KarmaChannelResetCommand';
import {KarmaLeaderboardGetCommand} from '../KarmaLeaderboardGetCommand';
import {KarmaUserGetCommand} from '../KarmaUserGetCommand';
import {KARMA_COMMAND_OPTIONS} from './options';
import {ensureGuildIsAvailable, ensureUserIsAvailable} from './predicates';

const FORWARDABLE_COMMANDS = {
    channel: {
        enable: KarmaChannelEnableCommand,
        disable: KarmaChannelDisableCommand,
        reset: KarmaChannelResetCommand,
    },
    user: {
        get: KarmaUserGetCommand,
    },
    leaderboard: {
        get: KarmaLeaderboardGetCommand,
    },
};

export const KarmaCommand = new Command({
    name: 'karma',
    description: "Wego Overseer's karma system",
    options: KARMA_COMMAND_OPTIONS,
    run: async (interaction, self) => {
        await ensureUserIsAvailable(interaction.user.id);
        await ensureGuildIsAvailable(interaction.guild?.id);

        const group = interaction.options.getSubcommandGroup()!;
        const cmd = interaction.options.getSubcommand();

        // Kinda ugly but it works, I guess.
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const forwardable = FORWARDABLE_COMMANDS[group][cmd];
        await self.forwardTo(forwardable, interaction);

        // TODO: make sure interaction always gets a reply
        interaction.replied ? null : await interaction.reply('blablabla');
    },
});
