import merge from './merge';
import { Indexed } from '../services/Store';

function set(object: Indexed | unknown, path: string, value: unknown): Indexed | unknown {
    if (typeof object !== 'object' || object === null) {
        return object;
    }

    if (typeof path !== 'string') {
        throw new Error('path must be string');
    }
    
    if (path) {
        const result = path.split('.').reduceRight<Indexed>((acc, key) => ({
            [key]: acc,
        }), value as unknown);
        return merge(object as Indexed, result);
    }

    return merge(object as Indexed, value as Record<string, unknown>)
}

export default set;
