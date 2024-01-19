import Model from '@/app/entities/Model';
import {randomUUID} from 'crypto';
import {Pojo, RelationMappings} from 'objection';
import PollOption from './PollOption';

export default class Poll extends Model {
    id!: string;
    title!: string;
    description!: string;
    allowMultipleVotes!: boolean;

    // Relationships
    options!: PollOption[];

    static get relationMappings(): RelationMappings {
        return {
            options: {
                relation: Model.HasManyRelation,
                modelClass: PollOption,
                join: {
                    from: 'polls.id',
                    to: 'poll_options.pollId',
                },
            },
        };
    }

    static get tableName() {
        return 'polls';
    }

    $parseDatabaseJson(json: Pojo): Pojo {
        return {
            ...json,
            allowMultipleVotes: Boolean(parseInt(json.allowMultipleVotes)),
        };
    }

    $beforeInsert(): void {
        super.$beforeInsert();

        this.id = randomUUID();
    }
}
