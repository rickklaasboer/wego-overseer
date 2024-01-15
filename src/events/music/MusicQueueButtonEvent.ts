import BaseEvent from '@/events/BaseEvent';
import {Interaction, CacheType} from 'discord.js';
import DiscordPlayerService from '@/services/music/DiscordPlayerService';
import {injectable} from 'tsyringe';
import Logger from '@/telemetry/logger';

@injectable()
export default class MusicQueueButtonEvent
    implements BaseEvent<'interactionCreate'>
{
    public name = 'MusicQueueButtonEvent';
    public event = 'interactionCreate' as const;
    private eventTypes = {
        prev: 'PREV',
        playPause: 'PLAYPAUSE',
        stop: 'STOP',
        next: 'NEXT',
    };

    constructor(
        private playerService: DiscordPlayerService,
        private logger: Logger,
    ) {}

    /**
     * Run the event
     */
    public async execute(interaction: Interaction<CacheType>): Promise<void> {
        try {
            // Terminate if not a button
            if (!interaction.isButton()) return;

            // Terminate if not a music button
            if (!interaction.customId.startsWith('MUSIC')) return;

            const [, action] = interaction.customId.split('_') as string[];

            await interaction.deferUpdate();

            if (!interaction.guild?.id) {
                this.logger.error('Could not find guild for interaction');
                throw new Error(
                    'Unable to handle MusicQueueButtonEvent because guild is undefined',
                );
            }

            const player = await this.playerService.getPlayer();
            const queue = player.nodes.get(interaction.guild?.id);

            if (!queue) {
                this.logger.error('Could not find queue for interaction');
                throw new Error(
                    'Unable to handle MusicQueueButtonEvent because queue is undefined',
                );
            }

            if (action === this.eventTypes.prev) {
                await queue.history.back();
                return;
            }

            if (action === this.eventTypes.playPause) {
                queue.node.pause();
                return;
            }

            if (action === this.eventTypes.stop) {
                queue.delete();
                return;
            }

            if (action === this.eventTypes.next) {
                queue.node.skip();
                return;
            }
        } catch (err) {
            this.logger.fatal('Failed to run MusicQueueButtonEvent', err);
        }
    }
}
