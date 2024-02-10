import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaRepository from '@/app/repositories/KarmaRepository';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import { METHODS } from 'http';
import {injectable} from 'tsyringe';

@injectable()
export default class KarmaUserGraphCommand extends BaseInternalCommand {
    constructor(
        private karmaRepository: KarmaRepository,
        private logger: Logger,
    ) {
        super();
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        // NOG GROTE STUK
        try {
            const user =
                interaction.options.getUser('user') ?? interaction.user;

            const sum:any = await this.karmaRepository.getKarma(
                interaction.guildId!,
                user.id,
            );

            const chart = {
                type: 'line',
                data: {
                  labels: sum.map((k:any) => k.week),
                  datasets: [
                    {
                        label: 'Total Karma', 
                        data: sum.map((k:{week:string,weekly_sum:number},i:number) => { return sum.slice(0, i+1).reduce((sum:number,current:{week:string,weekly_sum:number}) => sum+current.weekly_sum, 0) })
                        // data: sum.map((k:any) => k.weekly_sum)
                    },
                    {
                        type: 'bar',
                        label: 'Delta Karma', 
                        data: sum.map((k:any) => k.weekly_sum)
                    }
                  ],
                  lineTension: 0.1
                },
              };

            const encodedChart = encodeURIComponent(JSON.stringify(chart));
            const chartUrl = `https://quickchart.io/chart?c=${encodedChart}`;
            const data = {
                chart: chart
              }
            const response = await fetch('https://quickchart.io/chart/create',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            this.logger.info(responseData);

            const text = trans(
                'commands.karma.graph.get.result',
                user.username,
                sum.reduce((sum:any,current:any) => sum+current.weekly_sum, 0).toString()
            );
            const chartEmbed = {
                title: 'Karma Chart',
                description: text,
                image: {
                  url: responseData.url
                },
              };

            await interaction.followUp(
                {embeds: [chartEmbed]}
                
                
            );
        } catch (err) {
            this.logger.fatal('Failed to get karma for user', err);
        }
    }
}
