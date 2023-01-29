import Command from '@/commands/Command';
import Karma from '@/entities/Karma';
import {trans} from '@/util/localization';

export const KarmaUserGetCommand = new Command({
    name: 'internal',
    description: 'internal',
    run: async (interaction) => {
        const user = interaction.options.getUser('user') ?? interaction.user;

        const sum = (await Karma.query()
            .where({
                guildId: interaction.guild?.id,
                userId: user.id,
            })
            .sum('amount as totalKarma')
            .first()) as Karma & {totalKarma: number};

        await interaction.reply(
            trans(
                'commands.karma.user.get.result',
                user.username,
                String(sum.totalKarma ?? 0),
            ),
        );
    },
});
