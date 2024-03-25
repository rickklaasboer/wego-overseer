import Logger from '@/telemetry/logger';
import BaseJob from '@/app/jobs/BaseJob';
import {injectable} from 'tsyringe';
import config from '@/config';
import {tap} from '@/util/misc/tap';

@injectable()
export default class HeartbeatJob implements BaseJob {
    public name = 'HeartbeatJob';
    public schedule = '* * * * *';

    constructor(private logger: Logger) {}

    /**
     * Run the job
     */
    public async execute(): Promise<void> {
        try {
            const url = tap(new URL(config.heartbeat.url), (url) => {
                url.searchParams.append('status', 'up');
                url.searchParams.append('msg', 'OK');
                url.searchParams.append('ping', '0');
            });

            const request = await fetch(url);
            const response = await request.json();

            if (!response.ok) {
                this.logger.error('Failed to send heartbeat', response);
            }

            this.logger.info('Sent heartbeat', response);
        } catch (err) {
            this.logger.error('Failed to run HeartbeatJob', err);
        }
    }
}
