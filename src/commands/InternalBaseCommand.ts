import BaseCommand, {
    DefaultInteraction,
    SlashCommandOption,
} from '@/commands/BaseCommand';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {injectable} from 'inversify';

@injectable()
export default abstract class InternalBaseCommand<
    T extends DefaultInteraction = DefaultInteraction,
> extends BaseCommand<T> {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    constructor() {
        super();
        this.name = '__INTERNAL__';
        this.description = '__INTERNAL__';
        this.enabled = true;
    }

    public abstract execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void>;
}
