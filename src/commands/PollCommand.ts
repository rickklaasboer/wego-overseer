import {EmbedBuilder, Colors} from 'discord.js';
import Command, {APPLICATION_COMMAND_OPTIONS} from '@/commands/Command';

const DEFAULT_VOTE_OPTIONS = ['👍', '🤨', '👎'];

export const PollCommand = new Command({
    name: 'poll',
    description: 'Create a poll for others to vote',
    options: [
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'title',
            description: 'Poll title',
            required: true,
            min_length: 1,
            max_length: 256,
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'description',
            description: 'Explanation/elaboration/etc (optional)',
            required: false,
            min_length: 1,
            max_length: 4096,
        },
        {
            type: APPLICATION_COMMAND_OPTIONS.STRING,
            name: 'vote-emojis',
            description:
                'Comma-separated vote emojis (optional, default = ' +
                DEFAULT_VOTE_OPTIONS.join(',') +
                ')',
            required: false,
            min_length: 1,
            max_length: 256,
        },
    ],
    run: async (interaction) => {
        const voteOptions =
            interaction.options.getString('vote-emojis')?.split(',') ??
            DEFAULT_VOTE_OPTIONS;

        const emojis: Array<string> = [];

        for (let i = 0; i < voteOptions.length; i++) {
            voteOptions[i] = voteOptions[i].trim();
            emojis.push(
                interaction.client.emojis.cache.find(
                    (e) => e.toString() === voteOptions[i],
                )?.id ?? voteOptions[i],
            );
        }

        const question = new EmbedBuilder()
            .setColor(Colors.Blue)
            .setTitle(interaction.options.getString('title'))
            .setFooter({
                text: 'Created by: ' + interaction.user.username,
                iconURL: interaction.user.displayAvatarURL(),
            })
            .setTimestamp();

        if (interaction.options.getString('description')) {
            question.setDescription(
                `${interaction.options.getString('description')}`,
            );
        }

        const message = await interaction.reply({
            embeds: [question],
            fetchReply: true,
        });

        const failedReactions: Array<string> = [];

        for (let i = 0; i < emojis.length; i++) {
            try {
                await message.react(emojis[i]);
            } catch {
                failedReactions.push(voteOptions[i]);
            }
        }

        if (failedReactions.length > 0) {
            await interaction.followUp({
                content:
                    'Whoops! Some reactions failed: ' +
                    failedReactions.join(','),
                ephemeral: true,
            });
        }
    },
});
