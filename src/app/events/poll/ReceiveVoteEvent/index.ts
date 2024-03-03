import Poll from '@/app/entities/Poll';
import PollOption from '@/app/entities/PollOption';
import PollVote from '@/app/entities/PollVote';
import PollBuilder, {VoteActionButtonPayload} from '@/util/PollBuilder';
import BaseEvent from '@/app/events/BaseEvent';
import {Interaction, CacheType} from 'discord.js';
import Logger from '@/telemetry/logger';
import {injectable} from 'tsyringe';
import EnsureUserIsAvailable from '@/app/events/poll/ReceiveVoteEvent/middleware/EnsureUserIsAvailable';

@injectable()
export default class ReceiveVoteEvent
    implements BaseEvent<'interactionCreate'>
{
    public name = 'ReceiveVoteEvent';
    public event = 'interactionCreate' as const;

    public middleware = [EnsureUserIsAvailable];

    constructor(private logger: Logger) {}

    /**
     * Run the command
     *
     * TODO: refactor this sometime, because it's a bit of a mess, but it works, kinda, sometimes.
     */
    public async execute(interaction: Interaction<CacheType>): Promise<void> {
        try {
            // Terminate if not a button
            if (!interaction.isButton()) return;

            const [eventType, pollId, pollOptionId] =
                interaction.customId.split('|') as VoteActionButtonPayload;

            // Terminate if not a vote button
            if (!eventType.startsWith('VOTE')) return;

            await interaction.deferUpdate();

            const poll = await Poll.query()
                .withGraphFetched({
                    options: {votes: true},
                })
                .findById(pollId);

            const option = await PollOption.query().findById(pollOptionId);

            if (!poll) return;
            if (!option) return;

            const pollOptionIds = poll.options.map(({id}) => id);
            const prevVotes = await PollVote.query()
                .whereIn('pollOptionId', pollOptionIds)
                .andWhere('userId', interaction.user.id);

            if (!poll.allowMultipleVotes && prevVotes.length > 0) {
                for (const vote of prevVotes) {
                    await PollVote.query().deleteById(vote.id);
                }
            }

            if (poll.allowMultipleVotes && prevVotes.length > 0) {
                const prevVotesIds = prevVotes.map(({id}) => id);
                const sameVote = poll.options
                    .find(({id}) => pollOptionId === id)
                    ?.votes?.find(({id}) => prevVotesIds.includes(id));

                if (sameVote instanceof PollVote) {
                    await PollVote.query().deleteById(sameVote.id);
                }
            }

            await PollOption.relatedQuery('votes')
                .for(option.id)
                .insert({userId: interaction.user.id});

            // Refetch
            const refetched = await poll
                .$query()
                .withGraphFetched({options: {votes: true}});

            const pollBuilder = new PollBuilder(refetched, interaction);
            await interaction.message.edit(await pollBuilder.toReply());
        } catch (err) {
            this.logger.fatal('Failed to run poll command', err);
        }
    }
}
