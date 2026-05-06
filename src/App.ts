import * as Pages from './pages'
import Router from './services/Router';
import { Routes } from './consts/consts';
import AuthController from './controller/AuthController';
import Store from './services/Store';
import { IResponse, IResponseAdd } from './api/HTTPTransport';

export default class App {
    async render() {
        await AuthController.getUser().then((response: IResponse<IResponseAdd>) => {
            if (response.status !== 200) {
                Router.go(Routes.LOGIN);
                return
            }
            const userInfo = JSON.parse(response.responseText);
            Store.set('isAuthenticated', true);
            Store.set('user', userInfo);
            if (window.location.pathname === Routes.LOGIN || window.location.pathname === Routes.REGISTER) {
                Router.go(Routes.MESSENGER);
            }
        });
        Router
            .use(Routes.LOGIN, Pages.LoginPage)
            .use(Routes.REGISTER, Pages.RegistrationPage)
            .use(Routes.MESSENGER, Pages.ChatPage)
            .use(Routes.PROFILE, Pages.SettingsPage)
            .use(Routes.BAD_SERVER, Pages.ErrorPage)
            .use(Routes.NOT_FOUND, Pages.ErrorPage)
            .start();
    }
}
