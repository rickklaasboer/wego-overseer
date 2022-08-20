import BaseModel from '@/entities/BaseModel';

export default class Guild extends BaseModel {
    id!: number;

    static get tableName() {
        return 'guilds';
    }
}
