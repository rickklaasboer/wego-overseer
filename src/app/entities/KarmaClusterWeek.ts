import Channel from '@/app/entities/Channel';
import Guild from '@/app/entities/Guild';
import Model from '@/app/entities/Model';
import User from '@/app/entities/User';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';

export default class KarmaClusterWeek extends Model {
    amount!: number;
    week!: string;
    guildId!: string;
    userId!: string;

    static get relationMappings(): RelationMappings {
        return {
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'karma.guildId',
                    to: 'guilds.id',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'karma.userId',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'karma';
    }
}
