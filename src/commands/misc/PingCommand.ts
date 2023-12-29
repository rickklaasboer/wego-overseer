import BaseCommand, {SlashCommandOption} from '@/commands/BaseCommand';
import {Maybe} from '@/types/util';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {injectable} from 'inversify';

@injectable()
export default class PingCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    constructor() {
        super();
        this.name = 'ping';
        this.description = 'Ping!';
        this.options = null;
        this.enabled = true;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        await interaction.reply(
            `Pong! (${Math.abs(Date.now() - interaction.createdTimestamp)}ms)`,
        );
    }
}
