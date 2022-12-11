import Model from '@/entities/Model';

export default class Channel extends Model {
    id!: string;
    isKarmaChannel!: boolean;
    guildId!: string;

    static get tableName() {
        return 'channels';
    }
}
