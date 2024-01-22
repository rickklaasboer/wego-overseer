import Guild from '@/app/entities/Guild';
import User from '@/app/entities/User';
import {Model, RelationMappings} from 'objection';

export default class GuildUser extends Model {
    userId!: string;
    guildId!: string;

    user!: User;
    guild!: Guild;

    static get relationMappings(): RelationMappings {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'guilds_users.userId',
                    to: 'users.id',
                },
            },
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'guilds_users.guildId',
                    to: 'guilds.id',
                },
            },
        };
    }

    static get idColumn() {
        return ['guildId', 'userId'];
    }

    static get tableName() {
        return 'guilds_users';
    }
}
