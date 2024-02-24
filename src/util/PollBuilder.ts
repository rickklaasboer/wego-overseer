import Poll from '@/app/entities/Poll';
import StringBuilder from '@/util/formatting/StringBuilder';
import {wrapInCodeblock} from '@/util/misc/discord';
import {trans} from '@/util/localization/localization';
import {tableWithHead} from '@/util/formatting/table';
import {EmbedBuilder, EmbedFooterOptions} from 'discord.js';
import {
    ChatInputCommandInteraction,
    CacheType,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    ButtonInteraction,
    BaseMessageOptions,
} from 'discord.js';

type Interaction =
    | ChatInputCommandInteraction<CacheType>
    | ButtonInteraction<CacheType>;

export type VoteActionButtonPayload = [string, string, string];

/**
 * Everything below this line is magic. Don't touch it.
 *
 * I don't even know what's going on here anymore, but it works (sometimes).
 * Should probably be refactored at some point.
 * Not now though, I'm too lazy. I'm sorry.
 *
 * Just for future reference, I was here on 16-01-2024.
 */
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
            .setFooter(await this.createEmbedFooter());
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
                .setCustomId(['VOTE', this.poll.id, id].join('|'))
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
                [
                    trans('commands.poll.table.name'),
                    trans('commands.poll.table.number_of_votes'),
                ],
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

    /**
     * Create embed footer
     */
    private async createEmbedFooter(): Promise<EmbedFooterOptions> {
        // If it's a button interaction we should get the user from
        // the message intstead of the interaction.
        if (this.interaction instanceof ButtonInteraction) {
            // Fetch message because it's undefined by default on ButtonInteraction
            await this.interaction.message.fetch();

            return {
                text: trans(
                    'commands.poll.footer.text',
                    this.interaction.message.author.username,
                ),
                iconURL: this.interaction.message.author.displayAvatarURL(),
            };
        }

        return {
            text: trans('commands.poll.footer.text', this.interaction.user.tag),
            iconURL: this.interaction.user.displayAvatarURL(),
        };
    }
}
