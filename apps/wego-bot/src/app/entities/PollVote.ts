import Model from '@/app/entities/Model';
import PollOption from '@/app/entities/PollOption';
import User from '@/app/entities/User';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';

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
