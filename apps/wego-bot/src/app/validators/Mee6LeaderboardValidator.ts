import AjvService from '@/app/services/AjvService';
import {Mee6Leaderboard} from '@/types/mee6';
import {Maybe} from '@/types/util';
import Validator from '@/app/validators/Validator';
import {injectable} from 'tsyringe';
import schema from './schema/mee6leaderboard.schema.json';
import {ErrorObject} from 'ajv';

@injectable()
export default class Mee6LeaderboardValidator
    implements Validator<Mee6Leaderboard>
{
    constructor(private ajvService: AjvService) {}

    /**
     * Run the validator
     */
    public validate(data: Mee6Leaderboard): [boolean, Maybe<ErrorObject[]>] {
        const validator = this.ajvService.getAjv().compile(schema);
        const isValid = validator(data) as boolean;

        return [isValid, validator.errors];
    }
}
