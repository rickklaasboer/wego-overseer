import Model from '@/entities/Model';
import {RelationMappings} from 'objection';
import Channel from './Channel';
import User from './User';
import Experience from './Experience';

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
            experience: {
                relation: Model.HasManyRelation,
                modelClass: Experience,
                join: {
                    from: 'experience.id',
                    to: 'guilds.id',
                },
            },
        };
    }

    static get tableName() {
        return 'guilds';
    }
}
