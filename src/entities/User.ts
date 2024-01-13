import Model from '@/entities/Model';
import {RelationMappings} from 'objection';
import Guild from '@/entities/Guild';
import Karma from '@/entities/Karma';

export default class User extends Model {
    id!: string;
    dateOfBirth!: string;

    guilds!: Guild[];

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
            guilds: {
                relation: Model.ManyToManyRelation,
                modelClass: Guild,
                join: {
                    from: 'users.id',
                    through: {
                        from: 'guilds_users.userId',
                        to: 'guilds_users.guildId',
                    },
                    to: 'guilds.id',
                },
            },
        };
    }

    static get tableName() {
        return 'users';
    }
}
