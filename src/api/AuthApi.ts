import { BaseApi } from './BaseApi';
import HTTPTransport from './HTTPTransport';

export interface ISignUpRequestData {
    first_name: string,
    second_name: string,
    login: string,
    email: string,
    password: string,
    phone: string,
}

export interface ISignInRequestData {
    login: string,
    password: string,
}

const options = {
    headers: {
        Accept: 'application/json',
    },
};

export default class AuthApi extends BaseApi {

    static getUser() {
        return new HTTPTransport().get('/auth/user', options);
    }

    static logout() {
        return new HTTPTransport().post('/auth/logout', options);
    }

    static signIn(data: ISignInRequestData) {
        return new HTTPTransport().post('/auth/signin', {...options, data});
    }

    static signUp(data: ISignUpRequestData) {
        return new HTTPTransport().post('/auth/signup', {data: data});
    }
}
