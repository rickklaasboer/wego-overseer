import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import Command, {Props as CommandProps} from './Command';

type Interaction = ChatInputCommandInteraction<CacheType>;

type Props = Omit<CommandProps<Interaction>, 'name' | 'description'>;

const defaultProps = {
    name: '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED',
    description: '__INTERNAL_DO_NOT_REGISTER_OR_GET_PUBLICLY_SHAMED',
};

export default class InternalCommand extends Command<Interaction> {
    constructor(props: Props) {
        super({...props, ...defaultProps});
    }
}
