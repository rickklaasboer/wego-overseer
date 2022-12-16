import Model from '@/entities/Model';
import {RelationMappings} from 'objection';
import Channel from './Channel';

export default class Guild extends Model {
    id!: string;

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
        };
    }

    static get tableName() {
        return 'guilds';
    }
}
