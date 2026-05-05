import type { TChatPage } from '../pages/chatPage/chatPage';
import type { TErrorPage } from '../pages/errorPage';
import type { TLoginPage } from '../pages/loginPage/loginPage';
import type { TSettingsPage } from '../pages/settingsPage/settingsPage';
import type { TRegistrationPage } from '../pages/registrationPage/registrationPage';
import Block from './Block';
import Store from './Store';

export type TPageBlock = | TChatPage |
    TErrorPage |
    TLoginPage |
    TSettingsPage |
    TRegistrationPage;

interface RouteQuery {
    rootQuery: string,
}

export class Route {
    protected _pathname: string;
    protected _blockClass: TPageBlock;
    protected _block: null | Block;
    protected _props: RouteQuery;

    constructor(pathname: string, view: TPageBlock, props: RouteQuery) {
        this._pathname = pathname;
        this._blockClass = view;
        this._block = null;
        this._props = props;
    }

    render() {
        if (!this._block) {
            this._block = new this._blockClass({
                ...this._props,
                ...Store.getState()
            });
        }
        const rootEl = document.querySelector(this._props.rootQuery,);
        if (rootEl) {
            this._block.setProps({
                ...Store.getState(),
            });
            rootEl.innerHTML = '';
            rootEl.appendChild(this._block.getContent());
        }
    }

    navigate(pathname: string) {
        if (this.match(pathname)) {
            this._pathname = pathname;
            this.render();
        }
    }

    leave() {
        if (this._block) {
            this._block.hide();
        }
    }

    match(pathname: string) {
        return pathname === this._pathname;
    }
}

class Router {
    static __instance: Router;
    public routes: Array<unknown>;
    public history: History;
    protected _rootQuery: string;
    protected _currentRoute: null | Route;

    constructor(rootQuery: string) {
        if (Router.__instance) {
            return Router.__instance;
        }

        this.routes = [];
        this._rootQuery = rootQuery;
        this.history = window.history;
        this._currentRoute = null;

        Router.__instance = this;
    }

    protected _onRoute(pathname: string) {
        const route = this.getRoute(pathname) as Route;
        if (!route) {
            return;
        }

        if (this._currentRoute) {
            this._currentRoute.leave();
        }

        route.render();
    }

    use(pathname: string, block: TPageBlock) {
        const route = new Route(pathname, block, {rootQuery: this._rootQuery});

        this.routes.push(route);

        return this;
    }

    start() {
        window.onpopstate = event => {
            event.preventDefault();
            this._onRoute(window.location.pathname);
        }

        this._onRoute(window.location.pathname);
    }

    go(pathname: string) {
        history.pushState({}, '', pathname);
        this._onRoute(pathname);
    }

    back() {
        this.history.back();
    }

    forward() {
        this.history.forward();
    }

    getRoute(pathname: string) {
        return this.routes.find((route: Route) => route.match(pathname));
    }
}

export default new Router('#app');
