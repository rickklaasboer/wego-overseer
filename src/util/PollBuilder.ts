import Poll from '@/entities/Poll';
import {EmbedBuilder} from '@discordjs/builders';
import {
    ChatInputCommandInteraction,
    CacheType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction,
    BaseMessageOptions,
} from 'discord.js';
import {wrapInCodeblock} from './discord';
import StringBuilder from './StringBuilder';
import {tableWithHead} from './table';

type Interaction =
    | ChatInputCommandInteraction<CacheType>
    | ButtonInteraction<CacheType>;

export default class PollBuilder {
    private poll: Poll;
    private interaction: Interaction;

    constructor(poll: Poll, interaction: Interaction) {
        this.poll = poll;
        this.interaction = interaction;
    }

    /**
     * Get action row components for embed
     */
    public async getComponents(): Promise<ActionRowBuilder<ButtonBuilder>> {
        await this.poll.$fetchGraph('options', {
            skipFetched: true,
        });

        return new ActionRowBuilder<ButtonBuilder>({
            components: await this.getActionRowButtons(),
        });
    }

    /**
     * Create embed for poll
     */
    public async toEmbed(): Promise<EmbedBuilder> {
        await this.poll.$fetchGraph('options', {
            skipFetched: true,
        });

        return new EmbedBuilder()
            .setTitle(this.poll.title)
            .setDescription(this.createEmbedDescription())
            .setFooter({
                text: `Created by ${this.interaction.user.tag}`,
                iconURL: this.interaction.user.displayAvatarURL(),
            });
    }

    /**
     * Create reply options from poll builder
     */
    public async toReply(): Promise<BaseMessageOptions> {
        return {
            embeds: [await this.toEmbed()],
            components: [await this.getComponents()],
        };
    }

    private async getActionRowButtons(): Promise<ButtonBuilder[]> {
        await this.poll.$fetchGraph('options', {
            skipFetched: true,
        });

        return this.poll.options.map(({id, name}) => {
            return new ButtonBuilder()
                .setCustomId(`VOTE_${id}`)
                .setLabel(name)
                .setStyle(ButtonStyle.Primary);
        });
    }

    /**
     * Create description for embed
     */
    private createEmbedDescription(): string {
        const {description, options} = this.poll;

        const table = wrapInCodeblock(
            tableWithHead(
                ['Option name', '# Votes'],
                options.map((option) => [
                    option.name,
                    String(option.votes?.length ?? 0),
                ]),
            ),
        );

        return new StringBuilder(description)
            .append('\n\n')
            .append(table)
            .toString();
    }
}
