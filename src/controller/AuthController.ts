import { Controller } from './Controller';
import AuthApi, { ISignInRequestData, ISignUpRequestData } from '../api/AuthApi';
import { Routes } from '../consts/consts';

class AuthController extends Controller {
    public signIn = async (data: ISignInRequestData) => {
        return await AuthApi.signIn(data);
    }

    public signUp = async (data: ISignUpRequestData) => {
        return await AuthApi.signUp(data);
    }

    public getUser = async () => {
        return await AuthApi.getUser();
    }

    public logout = async () => {
        try {
            this.store.set('isLoading', true);
            const response = await AuthApi.logout() as Response;
            this.store.set('isLoading', false);
            if (response && response.status === 200) {
                this.store.set('isAuthenticated', false);
                this.store.set('user', null);
                this.router.go(Routes.LOGIN);
            }
        } catch (error) {
            console.log(error)
        }
    }
}

export default new AuthController();
