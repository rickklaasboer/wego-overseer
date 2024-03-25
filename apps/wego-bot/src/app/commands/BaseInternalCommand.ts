import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';
import {injectable} from 'tsyringe';

@injectable()
export default class BaseInternalCommand implements BaseCommand {
    public name = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public description = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public options = undefined;
    public shouldDeferReply = true;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(_interaction: DefaultInteraction): Promise<void> {
        throw new Error('Method not implemented.');
    }
}
