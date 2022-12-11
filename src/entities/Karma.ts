import Model from '@/entities/Model';

export default class Karma extends Model {
    id!: string;
    amount!: number;
    guildId!: string;
    userId!: string;
    receivedFromUserId!: string;
    channelId!: string;
    messageId!: string;

    static get tableName() {
        return 'karma';
    }
}
