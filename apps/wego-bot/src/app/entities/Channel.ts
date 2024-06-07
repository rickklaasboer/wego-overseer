import Guild from '@/app/entities/Guild';
import Model from '@/app/entities/Model';
import {RelationMappings} from 'objection';

export default class Channel extends Model {
    id!: string;
    isKarmaChannel!: boolean;
    guildId!: string;

    static get relationMappings(): RelationMappings {
        return {
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'channels.guildId',
                    to: 'guilds.id',
                },
            },
        };
    }

    static get tableName() {
        return 'channels';
    }
}
