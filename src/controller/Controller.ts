import Router from '../services/Router';
import Store from '../services/Store';

interface IController {
    router: typeof Router,
    store: typeof Store,
}

export class Controller implements IController {
    public router: typeof Router = Router;
    public store: typeof Store = Store;
}
