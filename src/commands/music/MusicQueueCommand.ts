import {wrapInCodeblock} from '@/util/discord';
import {trans} from '@/util/localization';
import {tableWithHead} from '@/util/table';
import {tap} from '@/util/tap';
import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder,
} from 'discord.js';
import {DefaultInteraction} from '@/commands/BaseCommand';
import BaseInternalCommand from '@/commands/BaseInternalCommand';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicQueueCommand extends BaseInternalCommand {
    constructor(
        private playerService: DiscordPlayerService,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const guild = interaction.guild;

            if (!guild) return;

            const embed = new EmbedBuilder();

            const player = await this.playerService.getPlayer();
            const queue = player.nodes.get(interaction.guild.id);

            if (!queue) {
                this.logger.info('Tried to get queue, but it does not exist');
                await interaction.editReply(
                    trans('commands.music.queue.queue_empty', guild.id),
                );
                return;
            }

            const contents = wrapInCodeblock(
                tableWithHead(
                    [
                        trans('commands.music.queue.table.head.position'),
                        trans('commands.music.queue.table.head.title'),
                    ],
                    queue.tracks.map(({title}, i) => [String(i + 1), title]),
                ),
            );

            embed.setDescription(contents);

            await interaction.editReply({
                embeds: [embed],
                components: [this.getActionRow()],
            });
        } catch (err) {
            this.logger.fatal('Failed to get queue', err);
        }
    }

    /**
     * Get the action row
     */
    private getActionRow(): ActionRowBuilder<ButtonBuilder> {
        return tap(new ActionRowBuilder<ButtonBuilder>(), (r) => {
            r.addComponents([
                new ButtonBuilder()
                    .setCustomId('MUSIC_PREV')
                    .setEmoji('⏮️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_PLAYPAUSE')
                    .setEmoji('⏯️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_STOP')
                    .setEmoji('⏹️')
                    .setStyle(ButtonStyle.Secondary),
                new ButtonBuilder()
                    .setCustomId('MUSIC_NEXT')
                    .setEmoji('⏭️')
                    .setStyle(ButtonStyle.Secondary),
            ]);
        });
    }
}
