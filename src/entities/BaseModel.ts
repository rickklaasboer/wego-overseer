import {toMysqlDateTime} from '@/util/mysql';
import {Model} from 'objection';

export default class BaseModel extends Model {
    createdAt!: string;
    updatedAt!: string;

    $beforeInsert() {
        this.createdAt = toMysqlDateTime(new Date());
    }

    $beforeUpdate() {
        this.updatedAt = toMysqlDateTime(new Date());
    }
}
