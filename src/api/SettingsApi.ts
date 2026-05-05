import { BaseApi } from './BaseApi';
import HTTPTransport from './HTTPTransport';
import { Indexed, TProfileDetails } from '../services/Store';

const options = {
    headers: {
        Accept: 'application/json',
    },
};

export default class SettingsApi extends BaseApi {
    static saveUserData(data: TProfileDetails) {
        return new HTTPTransport().put('/user/profile', {...options, data});
    }

    static saveUserPassword(data: Indexed) {
        return new HTTPTransport().put('/user/password', {...options, data});
    }

    static changeUserAvatar(data: FormData) {
        return new HTTPTransport().put('/user/profile/avatar', {...options, data});
    }
}
