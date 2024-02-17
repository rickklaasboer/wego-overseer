import {injectable} from 'tsyringe';
import {Graph} from '@/types/graph';
import Logger from '@/telemetry/logger';



@injectable()
export default class DiscordRestService {
    private defaultHeaders = {
        'Content-Type': 'application/json'
    };

    /**
     * Get graph url 
     */
    public async getGraph(chart_object: Object): Promise<Graph> {
        const request = await fetch(`https://quickchart.io/chart/create`, {
            method: 'POST',
            headers: {...this.defaultHeaders},
            body: JSON.stringify(chart_object)
        });
        const response = await request.json();
        return response as Graph;
    }
}
