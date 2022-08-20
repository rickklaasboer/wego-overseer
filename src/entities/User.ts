import BaseModel from '@/entities/BaseModel';

export default class User extends BaseModel {
    id!: string;
    xp!: number;
    xpAwardedAt!: string;

    static get tableName() {
        return 'users';
    }
}
