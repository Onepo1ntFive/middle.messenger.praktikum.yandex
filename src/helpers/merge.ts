import { Indexed } from '../services/Store';

function merge(lhs: Indexed, rhs: Indexed): Indexed {
    Object.keys(rhs).forEach((p) => {
        if (!rhs.hasOwnProperty(p)) {
            return;
        }

        try {
            if (rhs[p].constructor === Object) {
                rhs[p] = merge(lhs[p] as Indexed, rhs[p] as Indexed);
            } else {
                lhs[p] = rhs[p];
            }
        } catch (e) {
            lhs[p] = rhs[p];
        }
    });

    return lhs;
}

export default merge;
