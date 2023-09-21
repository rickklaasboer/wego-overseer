/* eslint-disable @typescript-eslint/no-non-null-assertion */
import Command from '@/commands/Command';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {KarmaChannelDisableCommand} from '../KarmaChannelDisableCommand';
import {KarmaChannelEnableCommand} from '../KarmaChannelEnableCommand';
import {KarmaLeaderboardGetCommand} from '../KarmaLeaderboardGetCommand';
import {KarmaUserGetCommand} from '../KarmaUserGetCommand';
import {KarmaUserResetCommand} from '../KarmaUserResetCommand';
import {KARMA_COMMAND_OPTIONS} from './options';
import {ensureGuildIsAvailable, ensureUserIsAvailable} from './predicates';

const logger = new Logger('wego-overseer:commands:KarmaCommand');

const FORWARDABLE_COMMANDS = {
    channel: {
        enable: KarmaChannelEnableCommand,
        disable: KarmaChannelDisableCommand,
    },
    user: {
        get: KarmaUserGetCommand,
        reset: KarmaUserResetCommand,
    },
    leaderboard: {
        get: KarmaLeaderboardGetCommand,
    },
};

export const KarmaCommand = new Command({
    name: 'karma',
    description: "Wego Overseer's karma system",
    options: KARMA_COMMAND_OPTIONS,
    run: async (interaction, self, ctx) => {
        try {
            await ensureUserIsAvailable(interaction.user.id);
            await ensureGuildIsAvailable(interaction.guild?.id);

            const group = interaction.options.getSubcommandGroup()!;
            const cmd = interaction.options.getSubcommand();

            // Kinda ugly but it works, I guess.
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const forwardable = FORWARDABLE_COMMANDS[group][cmd];

            // We don't have to surround all "subcommands" in their own try..catch
            // since this "host" command will already handle these for us.
            // How great!
            await self.forwardTo(forwardable, interaction, ctx)();
        } catch (err) {
            logger.fatal('Unable to handle KarmaCommand', err);
            await interaction.reply({
                content: trans('errors.common.failed', 'karma command'),
                ephemeral: true,
            });
        }
    },
});
