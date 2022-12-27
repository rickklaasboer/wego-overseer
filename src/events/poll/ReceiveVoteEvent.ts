import {ensureUserIsAvailable} from '@/commands/karma/KarmaCommand/predicates';
import Poll from '@/entities/Poll';
import PollOption from '@/entities/PollOption';
import PollVote from '@/entities/PollVote';
import Logger from '@/telemetry/logger';
import PollBuilder, {VoteActionButtonPayload} from '@/util/PollBuilder';
import Event from '../Event';

const logger = new Logger('wego-overseer:ReceiveVoteEvent');

export const ReceiveVoteEvent = new Event({
    name: 'interactionCreate',
    run: async (interaction) => {
        try {
            // Terminate if not a button
            if (!interaction.isButton()) return;

            const [eventType, pollId, pollOptionId] =
                interaction.customId.split('|') as VoteActionButtonPayload;

            // Terminate if not a vote button
            if (!eventType.startsWith('VOTE')) return;

            await ensureUserIsAvailable(interaction.user.id);

            await interaction.deferUpdate();

            const poll = await Poll.query()
                .withGraphFetched({
                    options: {votes: true},
                })
                .findById(pollId);

            const option = await PollOption.query().findById(pollOptionId);

            if (!(poll instanceof Poll)) return;
            if (!(option instanceof PollOption)) return;

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
            logger.error('Unable to handle ReceiveVoteEvent', err);
        }
    },
});
