import Cache from '@/app/cache/Cache';
import Swear from '@/app/entities/Swear';
import BaseRepository, {PrimaryKey} from '@/app/repositories/BaseRepository';
import {Maybe} from '@/types/util';
import {injectable} from 'tsyringe';

@injectable()
export default class SwearRepository implements BaseRepository<Swear> {
    constructor(private cache: Cache) {}

    /**
     * Get swear by ID
     */
    public async getById(id: PrimaryKey): Promise<Maybe<Swear>> {
        return this.cache.remember(['swear', id], 600, async () => {
            return await Swear.query().findById(id);
        });
    }

    /**
     * Get swear by where condition
     */
    public async getByWhere(condition: Partial<Swear>): Promise<Maybe<Swear>> {
        return this.cache.remember(
            ['swear', 'condition', JSON.stringify(condition)],
            600,
            async () => {
                return await Swear.query().where(condition).first();
            },
        );
    }

    /**
     * Check if a swear entry exists
     */
    public async exists(id: PrimaryKey): Promise<boolean> {
        return (await this.getById(id)) != null;
    }

    /**
     * Get all swear
     */
    public async getAll(): Promise<Swear[]> {
        return this.cache.remember(['swear'], 600, async () => {
            return await Swear.query();
        });
    }

    /**
     * Create swear
     */
    public async create(data: Partial<Swear>): Promise<Swear> {
        const result = await Swear.query().insert(data);
        await this.cache.forget(['swear']);
        return result;
    }

    /**
     * Update swear
     */
    public async update(id: PrimaryKey, data: Partial<Swear>): Promise<Swear> {
        const result = await Swear.query().updateAndFetchById(id, data);
        await this.cache.forget(['swear', id]);
        return result;
    }

    /**
     * Delete swear
     */
    public async delete(id: PrimaryKey): Promise<void> {
        await this.cache.forget(['swear', id]);
        await Swear.query().deleteById(id);
    }
}
