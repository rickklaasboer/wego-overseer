import {DefaultInteraction} from '@/app/commands/BaseCommand';
import BaseInternalCommand from '@/app/commands/BaseInternalCommand';
import Logger from '@/telemetry/logger';
import {trans} from '@/util/localization';
import {EmbedBuilder} from 'discord.js';
import {injectable} from 'tsyringe';
import GraphService from '@/app/services/graph/GraphService';
import KnexService from '@/app/services/KnexService';
import config from '@/config';


type Row = {
  week: string;
  amount: number;
  userId: string;
  guildId: string;
};

@injectable()
export default class KarmaUserGraphCommand extends BaseInternalCommand {
    constructor(
        private logger: Logger,
        private graphService: GraphService,
        private knexService: KnexService,
    ) {
        super();
    }

    private createChart(clusters: Row[]): Object {
      const chart = {width: config.karmagraph.width, height: config.karmagraph.height, c:{
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
      }};

      return chart;
    }

    /**
     * Run the command
     */
    public async execute(interaction: DefaultInteraction): Promise<void> {
        try {
            const user = interaction.options.getUser('user') ?? interaction.user;

            const knex = this.knexService.getKnex();
                
            const clusters = (await knex.table('karma')
                .select(knex.raw("DATE_FORMAT(createdAt, '%x-%v') AS week, SUM(amount) AS amount, guildId, userId"))
                .where({'guildId': interaction.guildId, 'userId': user.id})
                .orderBy('createdAt', 'asc')
                .groupBy('week')
                .limit(293)) as Row[];

            if (!clusters.length) {
              await interaction.reply(
                  trans('commands.karma.graph.get.not_available', user.username),
              );
            }
            
            const response = await this.graphService.getGraph(this.createChart(clusters));
            const embed = new EmbedBuilder()
            .setTitle(
              trans(
                  'commands.karma.graph.get.title',
              ),
            )
            .setDescription(
              trans(
                'commands.karma.graph.get.result',
                user.username,
                clusters.reduce((sum,current) => Number(sum)+Number(current.amount), 0).toString()
              )
            )
            .setImage(response.url)

            await interaction.followUp(
                {embeds: [embed]}
            );
        } catch (err) {
            this.logger.fatal('Failed to get karma for user', err);
        }
    }
}
