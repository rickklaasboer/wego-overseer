import BaseCommand, {DefaultInteraction} from '@/commands/BaseCommand';

export default abstract class BaseInternalCommand implements BaseCommand {
    public name = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public description = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public options = undefined;
    public enabled = true;

    public abstract execute(interaction: DefaultInteraction): Promise<void>;
}
