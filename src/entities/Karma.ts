import Model from '@/entities/Model';
import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';
import Channel from './Channel';
import Guild from './Guild';
import User from './User';

export default class Karma extends Model {
    id!: string;
    amount!: number;
    guildId!: string;
    userId!: string;
    receivedFromUserId!: string;
    channelId!: string;
    messageId!: string;

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
            receivedFrom: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'karma.receivedFromUserId',
                    to: 'users.id',
                },
            },
            channel: {
                relation: Model.BelongsToOneRelation,
                modelClass: Channel,
                join: {
                    from: 'karma.channelId',
                    to: 'channels.id',
                },
            },
        };
    }

    static get tableName() {
        return 'karma';
    }

    $beforeInsert(): void {
        super.$beforeInsert();

        this.id = randomUUID();
    }
}
