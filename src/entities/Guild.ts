import Model from '@/entities/Model';

export default class Guild extends Model {
    id!: number;

    static get tableName() {
        return 'guilds';
    }
}
