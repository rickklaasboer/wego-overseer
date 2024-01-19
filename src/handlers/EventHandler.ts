import BaseEvent, {ClientEventsKeys, EventKeys} from '@/app/events/BaseEvent';
import Logger from '@/telemetry/logger';
import {Pipeline} from '@/util/Pipeline';
import {container, injectable} from 'tsyringe';

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
            // prettier-ignore
            const pipeline = container.resolve<Pipeline<ClientEventsKeys>>(
                Pipeline
            );

            const passed = await pipeline
                .send(args)
                .through(event.middleware ?? [])
                .go();

            await event.execute(...passed);
        } catch (err) {
            this.logger.error(`Failed toexecute event ${event.name}`, err);
        }
    }
}
