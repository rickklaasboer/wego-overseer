import Model from '@/entities/Model';

export default class Guild extends Model {
    id!: string;

    static get tableName() {
        return 'guilds';
    }
}
