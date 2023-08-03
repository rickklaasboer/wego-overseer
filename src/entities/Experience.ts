import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';
import Model from '@/entities/Model';
import Guild from '@/entities/Guild';
import User from '@/entities/User';
import {Extends} from '@/types/util';

export default class Experience extends Model {
    id!: string;
    amount!: number;
    guildId!: string;
    userId!: string;

    user!: User;
    guild!: Guild;

    static get relationMappings(): RelationMappings {
        return {
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'experience.guildId',
                    to: 'guilds.id',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'experience.userId',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'experience';
    }

    $beforeInsert(): void {
        super.$beforeInsert();
        this.id = randomUUID();
    }
}
