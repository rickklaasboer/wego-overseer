import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/app/commands/BaseCommand';
import PollOptionRepository from '@/app/repositories/PollOptionRepository';
import PollRepository from '@/app/repositories/PollRepository';
import Logger from '@/telemetry/logger';
import PollBuilder from '@/util/PollBuilder';
import {injectable} from 'tsyringe';

@injectable()
export default class PollCommand implements BaseCommand {
    public name = 'poll';
    public description = 'Create a poll for others to vote';
    public options = [
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
            description:
                'Comma-seperated list of options, defaults to Yes, No, Maybe',
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.BOOLEAN,
            name: 'allow_multiple_votes',
            description: 'Whether or not users can vote multiple times',
        },
    ];
    private defaultVoteOptions = ['Yes', 'No', 'Maybe'];

    constructor(
        private pollRepository: PollRepository,
        private pollOptionRepository: PollOptionRepository,
        private logger: Logger,
    ) {}

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const {options, ...rest} = this.getCommandArguments(interaction);

            const poll = await this.pollRepository.create(rest);
            const optionRows = options.map((option) => ({
                name: option,
            }));

            for (const {name} of optionRows) {
                await this.pollOptionRepository.create({
                    pollId: poll.id,
                    name,
                });
            }

            const pollBuilder = new PollBuilder(poll, interaction);
            await interaction.reply(await pollBuilder.toReply());
        } catch (err) {
            this.logger.fatal('Failed to run poll command', err);
        }
    }

    /**
     * Get the command arguments
     */
    private getCommandArguments({options}: DefaultInteraction) {
        const opts =
            options.getString('options')?.split(',') ?? this.defaultVoteOptions;
        const title = options.getString('title')!;
        const description =
            options.getString('description') ?? 'No description provided';
        const allowMultipleVotes =
            options.getBoolean('allow_multiple_votes') ?? false;

        return {options: opts, title, description, allowMultipleVotes};
    }
}
