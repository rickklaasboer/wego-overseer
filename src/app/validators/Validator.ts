import {Maybe} from '@/types/util';
import {ErrorObject} from 'ajv';

export default interface Validator<TData> {
    validate(data: TData): [boolean, Maybe<ErrorObject[]>];
}
