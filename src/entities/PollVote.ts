import Model from '@/entities/Model';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';
import PollOption from './PollOption';
import User from './User';

export default class PollVote extends Model {
    id!: string;
    userId!: string;
    pollOptionId!: string;

    // Relationships
    option?: PollOption;
    user?: User;

    static get relationMappings(): RelationMappings {
        return {
            option: {
                relation: Model.BelongsToOneRelation,
                modelClass: PollOption,
                join: {
                    from: 'poll_votes.pollOptionId',
                    to: 'poll_options.id',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'poll_votes.userId',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'poll_votes';
    }

    $beforeInsert(): void {
        super.$beforeInsert();

        this.id = randomUUID();
    }
}
