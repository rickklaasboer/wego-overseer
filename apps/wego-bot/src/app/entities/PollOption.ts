import Model from '@/app/entities/Model';
import Poll from '@/app/entities/Poll';
import PollVote from '@/app/entities/PollVote';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';

export default class PollOption extends Model {
    id!: string;
    name!: string;
    pollId!: string;

    // Relationships
    poll?: Poll;
    votes?: PollVote[];

    static get relationMappings(): RelationMappings {
        return {
            poll: {
                relation: Model.BelongsToOneRelation,
                modelClass: Poll,
                join: {
                    from: 'poll_options.pollId',
                    to: 'polls.id',
                },
            },
            votes: {
                relation: Model.HasManyRelation,
                modelClass: PollVote,
                join: {
                    from: 'poll_options.id',
                    to: 'poll_votes.pollOptionId',
                },
            },
        };
    }

    static get tableName() {
        return 'poll_options';
    }

    $beforeInsert(): void {
        super.$beforeInsert();

        this.id = randomUUID();
    }
}
