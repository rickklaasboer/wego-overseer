import Model from '@/app/entities/Model';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';

export default class Reminder extends Model {
    id!: string;
    userId!: string;
    reminder!: string;
    remindAt!: Date;

    static get tableName() {
        return 'reminders';
    }

    static get relationMappings(): RelationMappings {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: 'User',
                join: {
                    from: 'reminders.userId',
                    to: 'users.id',
                },
            },
        };
    }

    $beforeInsert(): void {
        super.$beforeInsert();

        this.id = randomUUID();
    }
}
