import Store, { Indexed, StoreEvents } from './Store';
import isEqual from '../helpers/isEqual';
import Block, { Props } from './Block';

function connect(mapStateToProps: (state: Indexed) => Indexed) {
    return function (Component: typeof Block) {
        return class extends Component {
            constructor(props: Props) {
                let state = mapStateToProps(Store.getState());

                super({...props, ...state});

                Store.on(StoreEvents.STORE_UPD, () => {
                    const newState = mapStateToProps(Store.getState());
                    
                    if (!isEqual(state, newState)) {
                        this.setProps({...newState});
                    }

                    state = newState;
                });
            }
        }
    }
}

export default connect;