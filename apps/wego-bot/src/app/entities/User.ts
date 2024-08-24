import Model from '@/app/entities/Model';
import {RelationMappings} from 'objection';
import Guild from '@/app/entities/Guild';
import Karma from '@/app/entities/Karma';
import Experience from '@/app/entities/Experience';
import {Maybe} from '@/types/util';

export default class User extends Model {
    id!: string;
    dateOfBirth!: string;
    avatar!: Maybe<string>;
    username!: Maybe<string>;

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
            experience: {
                relation: Model.HasManyRelation,
                modelClass: Experience,
                join: {
                    from: 'experience.id',
                    to: 'users.id',
                },
            },
        };
    }

    static get tableName() {
        return 'users';
    }
}
