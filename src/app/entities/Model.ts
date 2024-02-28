import {toMysqlDateTime} from '@/util/misc/mysql';
import {Model as ObjectionModel} from 'objection';

export default class Model extends ObjectionModel {
    createdAt!: string;
    updatedAt!: string;

    $beforeInsert() {
        this.createdAt = toMysqlDateTime(new Date());
    }

    $beforeUpdate() {
        this.updatedAt = toMysqlDateTime(new Date());
    }
}
