import BaseCommand, {DefaultInteraction} from '@/app/commands/BaseCommand';

export default abstract class BaseInternalCommand implements BaseCommand {
    public name = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public description = '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED__';
    public options = undefined;
    public shouldDeferReply = true;

    public abstract execute(interaction: DefaultInteraction): Promise<void>;
}
