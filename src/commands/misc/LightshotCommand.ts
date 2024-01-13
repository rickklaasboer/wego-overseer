import BaseCommand, {
    APPLICATION_COMMAND_OPTIONS,
    DefaultInteraction,
} from '@/commands/BaseCommand';
import crypto from 'crypto';
import {injectable} from 'tsyringe';

@injectable()
export default class LightshotCommand implements BaseCommand {
    public name = 'lightshot';
    public description = 'Get a random lightshot URL';
    public options = [
        {
            name: 'length',
            description: 'Length of identifier (default: 6)',
            min_value: 6,
            max_value: 64,
            type: APPLICATION_COMMAND_OPTIONS.INTEGER,
        },
    ];

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        const length = interaction.options.getInteger('length') ?? 6;
        const random = crypto.randomBytes(64).toString('hex').slice(0, length);
        await interaction.reply(`https://prnt.sc/${random}`);
    }
}
