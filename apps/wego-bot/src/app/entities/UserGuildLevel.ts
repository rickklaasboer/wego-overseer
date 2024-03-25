import {Model, RelationMappings} from 'objection';
import Guild from '@/app/entities/Guild';
import User from '@/app/entities/User';

export default class UserGuildLevel extends Model {
    guildId!: string;
    userId!: string;
    level!: number;

    user!: User;
    guild!: Guild;

    static get relationMappings(): RelationMappings {
        return {
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'user_guild_level.userId',
                    to: 'users.id',
                },
            },
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'user_guild_level.guildId',
                    to: 'guilds.id',
                },
            },
        };
    }

    static get idColumn() {
        return ['guildId', 'userId'];
    }

    static get tableName() {
        return 'user_guild_level';
    }
}
