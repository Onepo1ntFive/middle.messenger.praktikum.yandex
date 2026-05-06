import Block, { Props } from '../../services/Block';
import template from './passwordPage.hbs?raw';
import { Avatar, Button, Input } from '../../components';
import { isFormValid } from '../../helpers/form';
import connect from '../../services/connectStore';
import Store, { Indexed, TSettings, TUserDetails } from '../../services/Store';
import SettingsController from '../../controller/SettingsController';

interface PasswordPageProps extends Props {
    onRouteShowProfile: () => void;
}

class PasswordPage extends Block {
    constructor(props: PasswordPageProps) {
        const user = props.user as TUserDetails;
        const inputs: Input[] = [
            new Input({
                label: 'Старый пароль',
                type: 'password',
                name: 'oldPassword',
                id: 'oldPassword',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Новый пароль',
                type: 'password',
                name: 'newPassword',
                id: 'newPassword',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Новый пароль (повтор)',
                type: 'password',
                name: 'newPasswordRepeat',
                id: 'newPasswordRepeat',
                class: 'input--clear',
            }),
        ];
        const buttons = {
            Button: new Button({
                label: 'Сохранить',
                type: 'submit',
            }),
        }

        super({
            ...props,
            ...buttons,
            Avatar: new Avatar({
                ...props,
                avatarSrc: user.avatar ? `https://ya-praktikum.tech/api/v2/resources${ user.avatar }` : '',
            }),
            inputs: inputs,
            events: {
                submit: (event) => {
                    event.preventDefault();
                    const form = event.target?.form as HTMLFormElement;
                    if (isFormValid(form, inputs)) {
                        Store.set('isLoading', true);
                        const oldPasswordInput = document.getElementById('oldPassword') as HTMLFormElement;
                        const newPasswordInput = document.getElementById('newPassword') as HTMLFormElement;
                        const newPasswordRepeatInput = document.getElementById('newPasswordRepeat') as HTMLFormElement;
                        SettingsController.saveUserPassword({
                            oldPassword: oldPasswordInput.value,
                            newPassword: newPasswordInput.value,
                        }).then((response) => {
                            Store.set('isLoading', false);
                            if (response.status !== 200) {
                                const resp = JSON.parse(response.response)
                                alert(`${response.status}: ${resp.reason}`);
                                return;
                            }
                            oldPasswordInput.value = '';
                            newPasswordInput.value = '';
                            newPasswordRepeatInput.value = '';
                            SettingsController.showProfile();
                            props.onRouteShowProfile();
                        })
                    }
                }
            },
        })
    }

    override render() {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    user: TUserDetails | unknown,
    settings: TSettings | unknown,
    isLoading: boolean | unknown,
} {
    return {
        user: state.user,
        settings: state.settings,
        isLoading: state.isLoading
    };
}

export default connect(mapUserToProps)(PasswordPage)
