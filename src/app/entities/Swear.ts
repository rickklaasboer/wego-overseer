import Model from '@/app/entities/Model';
import User from '@/app/entities/User';
import {RelationMappings} from 'objection';

export default class Swear extends Model {
    id!: string;
    word!: string;
    userId!: string;
    count!: number;

    static get relationMappings(): RelationMappings {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'swears.userId',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'swears';
    }
}
