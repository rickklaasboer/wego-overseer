import Model from '@/entities/Model';

export default class User extends Model {
    id!: string;

    static get tableName() {
        return 'users';
    }
}
