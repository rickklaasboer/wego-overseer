import {injectable} from 'tsyringe';
import {Graph} from '@/types/graph';
import config from '@/config';

@injectable()
export default class DiscordRestService {
    private defaultHeaders = {
        'Content-Type': 'application/json',
    };

    /**
     * Get graph url
     */
    public async getGraph(options: unknown): Promise<Graph> {
        const request = await fetch(config.karma.graph.apiUrl, {
            method: 'POST',
            headers: {...this.defaultHeaders},
            body: JSON.stringify(options),
        });
        const response = await request.json();
        return response as Graph;
    }
}

