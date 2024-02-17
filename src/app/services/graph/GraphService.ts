import {injectable} from 'tsyringe';
import {Graph} from '@/types/graph';
import config from '@/config';




@injectable()
export default class DiscordRestService {
    private defaultHeaders = {
        'Content-Type': 'application/json'
    };

    /**
     * Get graph url 
     */
    public async getGraph(chart_object: any): Promise<Graph> {
        const request = await fetch(config.karmagraph.url, {
            method: 'POST',
            headers: {...this.defaultHeaders},
            body: JSON.stringify(chart_object)
        });
        const response = await request.json();
        return response as Graph;
    }
}
