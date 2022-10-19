import Model from '@/entities/Model';

export default class User extends Model {
    id!: string;
    xp!: number;
    xpAwardedAt!: string;

    static get tableName() {
        return 'users';
    }
}
