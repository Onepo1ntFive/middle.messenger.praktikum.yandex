import { Controller } from './Controller';
import SettingsApi from '../api/SettingsApi';
import { Indexed, TProfileDetails } from '../services/Store';

class SettingsController extends Controller {
    public editPassword = () => {
        this.store.set('settings.showProfile', false)
        this.store.set('settings.editProfile', false)
        this.store.set('settings.showPassword', true)
    }

    public showProfile = () => {
        this.store.set('settings.showProfile', true)
        this.store.set('settings.editProfile', false)
        this.store.set('settings.showPassword', false)
    }

    public async saveUserData(data: TProfileDetails) {
        return await SettingsApi.saveUserData(data)
    }

    public async saveUserPassword(data: Indexed) {
        return await SettingsApi.saveUserPassword(data)
    }
    public async changeUserAvatar(data: FormData) {
        return await SettingsApi.changeUserAvatar(data)
    }
}

export default new SettingsController();