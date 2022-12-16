import Model from '@/entities/Model';
import {RelationMappings} from 'objection';
import Karma from './Karma';

export default class User extends Model {
    id!: string;

    static get relationMappings(): RelationMappings {
        return {
            receivedKarma: {
                relation: Model.HasManyRelation,
                modelClass: Karma,
                join: {
                    from: 'karma.userId',
                    to: 'users.id',
                },
            },
            handedKarma: {
                relation: Model.HasManyRelation,
                modelClass: Karma,
                join: {
                    from: 'karma.receivedFromUserId',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'users';
    }
}
