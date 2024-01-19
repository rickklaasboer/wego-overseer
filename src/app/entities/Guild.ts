import Model from '@/app/entities/Model';
import {RelationMappings} from 'objection';
import Channel from './Channel';
import User from './User';

export default class Guild extends Model {
    id!: string;
    birthdayChannelId!: string;

    users!: User[];

    static get relationMappings(): RelationMappings {
        return {
            channels: {
                relation: Model.HasManyRelation,
                modelClass: Channel,
                join: {
                    from: 'guilds.id',
                    to: 'channels.guildId',
                },
            },
            users: {
                relation: Model.ManyToManyRelation,
                modelClass: User,
                join: {
                    from: 'guilds.id',
                    through: {
                        from: 'guilds_users.guildId',
                        to: 'guilds_users.userId',
                    },
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'guilds';
    }
}
