import BaseEvent, {ClientEventsKeys, EventKeys} from '@/app/events/BaseEvent';
import Logger from '@wego/logger';
import {Pipeline} from '@/util/Pipeline';
import {app} from '@/util/misc/misc';
import {injectable} from 'tsyringe';

@injectable()
export default class EventHandler {
    constructor(private logger: Logger) {}

    /**
     * Handle the event
     */
    public async handle(
        event: BaseEvent<EventKeys>,
        ...args: ClientEventsKeys
    ) {
        try {
            const pipeline = app<Pipeline<ClientEventsKeys>>(Pipeline);

            const passed = await pipeline
                .send(args)
                .through(event.middleware ?? [])
                .go();

            await event.execute(...passed);
        } catch (err) {
            this.logger.error(`Failed to execute event ${event.name}`, err);
        }
    }
}
