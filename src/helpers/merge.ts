import { Indexed } from '../services/Store';

function merge(lhs: Record<string, unknown>, rhs: Record<string, unknown>): Indexed {
    Object.keys(rhs).forEach((p) => {
        if (!Object.prototype.hasOwnProperty.call(rhs, p)) {
            return;
        }

        try {
            const t = rhs[p] as Indexed;
            if (t.constructor === Object) {
                rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch (e) {
            lhs[p] = rhs[p];
            p = e;
        }
    });

    return lhs;
}

export default merge;
