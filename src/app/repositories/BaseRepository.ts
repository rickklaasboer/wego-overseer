import Model from '@/app/entities/Model';
import {Maybe} from '@/types/util';

export type PrimaryKey = string | number;

export default interface BaseRepository<T extends Model> {
    /**
     * Get a model by its ID
     */
    getById(id: PrimaryKey): Promise<Maybe<T>>;

    /**
     * Get all models
     */
    getAll(): Promise<T[]>;

    /**
     * Create a new model
     */
    create(data: Partial<T>): Promise<T>;

    /**
     * Update a model
     */
    update(id: PrimaryKey, data: Partial<T>): Promise<T>;

    /**
     * Delete a model
     */
    delete(id: PrimaryKey): Promise<void>;
}
