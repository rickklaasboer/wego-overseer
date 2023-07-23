import Logger from '@/telemetry/logger';
import Event from '../Event';

const logger = new Logger('wego-overseer:events:MusicQueueButtonEvent');

const EVENT_TYPES = Object.freeze({
    prev: 'PREV',
    play_pause: 'PLAYPAUSE',
    stop: 'STOP',
    next: 'NEXT',
});

export const MusicQueueButtonEvent = new Event({
    name: 'interactionCreate',
    run: async ({player}, interaction) => {
        try {
            // Terminate if not a button
            if (!interaction.isButton()) return;

            // Terminate if not a music button
            if (!interaction.customId.startsWith('MUSIC')) return;

            const [, action] = interaction.customId.split('_') as string[];

            await interaction.deferUpdate();

            if (!interaction.guild?.id) {
                throw new Error(
                    'Unable to handle MusicQueueButtonEvent because guild is undefined',
                );
            }

            const queue = player.nodes.get(interaction.guild?.id);

            if (!queue) {
                throw new Error(
                    'Unable to handle MusicQueueButtonEvent because queue is undefined',
                );
            }

            if (action === EVENT_TYPES.prev) {
                await queue.history.back();
                return;
            }

            if (action === EVENT_TYPES.play_pause) {
                queue.node.pause();
                return;
            }

            if (action === EVENT_TYPES.stop) {
                queue.delete();
                return;
            }

            if (action === EVENT_TYPES.next) {
                queue.node.skip();
                return;
            }
        } catch (err) {
            logger.error('Unable to handle MusicQueueButtonEvent', err);
        }
    },
});
