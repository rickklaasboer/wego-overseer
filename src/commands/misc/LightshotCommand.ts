import BaseCommand, {SlashCommandOption} from '@/commands/BaseCommand';
import {Maybe} from '@/types/util';
import crypto from 'crypto';
import {ChatInputCommandInteraction, CacheType} from 'discord.js';
import {injectable} from 'inversify';

@injectable()
export default class LightshotCommand extends BaseCommand {
    public name: string;
    public description: string;
    public options: Maybe<SlashCommandOption[]>;
    public enabled: boolean;

    constructor() {
        super();
        this.name = 'lightshot';
        this.description = 'Get a random lightshot URL';
        this.options = null;
        this.enabled = true;
    }

    /**
     * Run the command
     */
    public async execute(
        interaction: ChatInputCommandInteraction<CacheType>,
    ): Promise<void> {
        const random = crypto.randomBytes(20).toString('hex').slice(0, 6);
        await interaction.reply(`https://prnt.sc/${random}`);
    }
}
