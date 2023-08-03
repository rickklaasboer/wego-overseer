import {randomUUID} from 'crypto';
import {RelationMappings} from 'objection';
import Model from '@/entities/Model';
import Guild from '@/entities/Guild';
import User from '@/entities/User';
import {Extends} from '@/types/util';

export default class Experience extends Model {
    id!: string;
    amount!: number;
    guildId!: string;
    userId!: string;

    user!: User;
    guild!: Guild;

    static get relationMappings(): RelationMappings {
        return {
            guild: {
                relation: Model.BelongsToOneRelation,
                modelClass: Guild,
                join: {
                    from: 'experience.guildId',
                    to: 'guilds.id',
                },
            },
            user: {
                relation: Model.BelongsToOneRelation,
                modelClass: User,
                join: {
                    from: 'experience.userId',
                    to: 'users.id',
                },
            },
        };
    }

    /**
     * Get the leaderboard for a guild.
     *
     * Should probably be moved to a service.
     *
     * I'm not sure if it's a good idea to have this in the model.
     * I'm not sure if it's a good idea to have the model at all.
     * I'm not sure if it's a good idea to have a database.
     * I'm not sure if it's a good idea to have a bot.
     * I'm not sure if it's a good idea to have a computer.
     * I'm not sure if it's a good idea to have a universe.
     * I'm not sure if it's a good idea to have a god.
     * I'm not sure if it's a good idea to have a good idea.
     * I'm not sure if it's a good idea to have.
     * I'm not sure if it's a good idea.
     * I'm not sure if it's a good.
     * I'm not sure if i ..
     */
    static async getLeaderboard(
        guildId: string,
    ): Promise<Extends<Experience, {totalExperience: number}>[]> {
        return (await Experience.query()
            .withGraphFetched({user: true})
            .where('guildId', '=', guildId)
            .sum('amount as totalExperience')
            .groupBy('userId')
            .orderBy('totalExperience', 'desc')) as Extends<
            Experience,
            {totalExperience: number}
        >[];
    }

    static get tableName() {
        return 'experience';
    }

    $beforeInsert(): void {
        super.$beforeInsert();
        this.id = randomUUID();
    }
}
