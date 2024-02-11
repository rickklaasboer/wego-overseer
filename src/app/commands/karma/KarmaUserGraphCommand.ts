import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import KarmaClusterWeek from '@/app/entities/KarmaClusterWeek';
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
        try {
            const user =
                interaction.options.getUser('user') ?? interaction.user;

            const clusters = await this.karmaRepository.getKarma(
                interaction.guildId!,
                user.id,
            );  

            const chart = {
                type: 'line',
                data: {
                  labels: clusters.map((k) => k.week),
                  datasets: [
                    {
                        label: 'Total Karma', 
                        data: clusters.map((k,i) => {return clusters.slice(0, i+1).reduce((sum,current) => Number(sum)+Number(current.amount), 0)}),
                        lineTension: 0.5,
                        order: 1,
                        yAxisID: 'y1',
                    },
                    {
                        type: 'bar',
                        label: 'Delta Karma', 
                        data: clusters.map((k) => k.amount),
                        order: 2,
                        yAxisID: 'y2',
                        backgroundColor: "rgba(220,148,72, 0.5)",
                    }
                  ],
                },
                options: {
                    scales: {
                      yAxes: [
                        {
                          id: 'y1',
                          display: true,
                          position: 'left',
                          stacked: true,
                        },
                        {
                          id: 'y2',
                          display: true,
                          position: 'right',
                          gridLines: {
                            drawOnChartArea: false,
                          },
                        },
                      ],
                    },
                }
              };
              
            const response = await fetch('https://quickchart.io/chart/create',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chart: chart
                })
            });

            const responseData = await response.json();

            const text = trans(
                'commands.karma.graph.get.result',
                user.username,
                clusters.reduce((sum,current) => Number(sum)+Number(current.amount), 0).toString()
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
