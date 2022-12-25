import Poll from '@/entities/Poll';
import PollOption from '@/entities/PollOption';
import PollVote from '@/entities/PollVote';
import Logger from '@/telemetry/logger';
import PollBuilder from '@/util/PollBuilder';
import Event from '../Event';

const logger = new Logger('wego-overseer:ReceiveVoteEvent');

export const ReceiveVoteEvent = new Event({
    name: 'interactionCreate',
    run: async (interaction) => {
        try {
            // Terminate if not a button
            if (!interaction.isButton()) return;

            // Terminate if not a vote button
            if (!interaction.customId.startsWith('VOTE_')) return;

            await interaction.deferUpdate();

            const [, id] = interaction.customId.split('_');

            // Fetch poll option with poll and vote
            const option = await PollOption.query()
                .findById(id)
                .withGraphFetched({
                    poll: {
                        options: true,
                    },
                    votes: true,
                });

            if (!(option instanceof PollOption)) return;

            // Remove exisiting vote when multiple votes
            // are not allowed
            if (!option.poll?.allowMultipleVotes) {
                await PollVote.query()
                    .whereIn(
                        'pollOptionId',
                        option.poll!.options.map(({id}) => id),
                    )
                    .andWhere('userId', interaction.user.id)
                    .delete();
            } else {
                const exists = await PollVote.query()
                    .where({
                        userId: interaction.user.id,
                        pollOptionId: option.id,
                    })
                    .first();

                // Vote already exists, skip
                if (exists instanceof PollVote) return;
            }

            // Insert new vote
            await PollOption.relatedQuery('votes')
                .for(option.id)
                .insert({userId: interaction.user.id});

            // Refetch poll with options and their votes
            const poll = await Poll.query()
                .findById(option.pollId)
                .withGraphFetched('options.[votes]');

            if (!(poll instanceof Poll)) return;

            // Update poll message with new counts
            const pollBuilder = new PollBuilder(poll, interaction);
            await interaction.message.edit(await pollBuilder.toReply());
        } catch (err) {
            logger.error('Unable to handle ReceiveVoteEvent', err);
        }
    },
});
