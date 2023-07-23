import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';
import Poll from '@/entities/Poll';
import Logger from '@/telemetry/logger';
import PollBuilder from '@/util/PollBuilder';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';

const logger = new Logger('wego-overseer:commands:KarmaCommand');

const DEFAULT_VOTE_OPTIONS = ['Yes', 'No', 'Maybe'];

function getCommandArgs(interaction: ChatInputCommandInteraction<CacheType>): {
    options: string[];
    title: string;
    description: string;
    allowMultipleVotes: boolean;
} {
    const options =
        interaction.options.getString('options')?.split(',') ??
        DEFAULT_VOTE_OPTIONS;
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const title = interaction.options.getString('title')!;
    const description =
        interaction.options.getString('description') ??
        'No description provided';
    const allowMultipleVotes =
        interaction.options.getBoolean('allow_multiple_votes') ?? false;

    return {options, title, description, allowMultipleVotes};
}

export const PollCommand = new Command({
    name: 'poll',
    description: 'Create a poll for others to vote',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'title',
            required: true,
            description: 'Title for poll',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'description',
            description: 'Description for poll',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'options',
            description: `Comma-seperated list of options, defaults to ${DEFAULT_VOTE_OPTIONS.join(
                ', ',
            )}`,
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.BOOLEAN,
            name: 'allow_multiple_votes',
            description: 'Whether or not users can vote multiple times',
        },
    ],
    run: async (interaction) => {
        try {
            const {options, ...rest} = getCommandArgs(interaction);

            const poll = await Poll.query().insert(rest);
            const optionRows = options.map((option) => ({
                name: option,
            }));

            for (const row of optionRows) {
                await Poll.relatedQuery('options').for(poll.id).insert(row);
            }

            const pollBuilder = new PollBuilder(poll, interaction);
            await interaction.reply(await pollBuilder.toReply());
        } catch (err) {
            logger.fatal('Unable to handle PollCommand', err);
        }
    },
});
