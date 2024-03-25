import Ajv from 'ajv';
import {injectable} from 'tsyringe';

@injectable()
export default class AjvService {
    private ajv: Ajv;

    constructor() {
        this.ajv = new Ajv({allErrors: true});
    }

    /**
     * Get the Ajv instance
     */
    public getAjv(): Ajv {
        return this.ajv;
    }
}
