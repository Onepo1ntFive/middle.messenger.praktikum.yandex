import Block, { Props } from '../../services/Block';
import template from './profilePage.hbs?raw';
import { Avatar, Button, Input, Link } from '../../components';
import { isFormValid } from '../../helpers/form';
import connect from '../../services/connectStore';
import Store, { Indexed, TSettings, TUserDetails } from '../../services/Store';
import SettingsController from '../../controller/SettingsController';
import AuthController from '../../controller/AuthController';

interface ProfilePageProps extends Props {
    onRouteEditPassword: () => void;
}

class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {
        const user = props.user as TUserDetails;

        const profileInputs: Input[] = [
            new Input({
                label: 'Почта',
                value: user.email,
                type: 'text',
                name: 'email',
                id: 'email',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Логин',
                value: user.login,
                type: 'text',
                name: 'login',
                id: 'login',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Имя',
                value: user.first_name,
                type: 'text',
                name: 'first_name',
                id: 'first_name',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Фамилия',
                value: user.second_name,
                type: 'text',
                name: 'second_name',
                id: 'second_name',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Имя в чате',
                value: user.display_name,
                type: 'text',
                name: 'display_name',
                id: 'display_name',
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Телефон',
                value: user.phone,
                type: 'text',
                name: 'phone',
                id: 'phone',
                class: 'input--clear',
                error: null,
            }),
        ];
        const buttons = {
            LinkEdit: new Link({
                label: 'Изменить данные',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        this.setProps({
                            settings: {
                                editProfile: true,
                            }
                        })
                    }
                }
            }),
            LinkPassword: new Link({
                label: 'Изменить пароль',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        SettingsController.editPassword();
                        props.onRouteEditPassword();
                    }
                }
            }),
            LinkLogout: new Link({
                label: 'Выйти',
                class: 'link--red',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        AuthController.logout();
                    }
                }
            }),
            Button: new Button({
                label: 'Сохранить',
                type: 'submit',
            }),
        }

        super({
            ...props,
            ...buttons,
            profileData: user.display_name,
            Avatar: new Avatar({
                ...props,
                avatarSrc: `https://ya-praktikum.tech/api/v2/resources${ user.avatar }`
            }),
            inputs: profileInputs,
            events: {
                blur: (event) => {
                    if (event.target) {
                        const eventTarget = event.target as HTMLFormElement;
                        if (eventTarget.name in user) {
                            Store.set(`user.${ eventTarget.name as keyof TUserDetails }`, eventTarget.value)
                        }
                    }
                },
                submit: (event) => {
                    event.preventDefault();
                    if (isFormValid(event, profileInputs)) {
                        const state = Store.getState();
                        Store.set('isLoading', true);
                        SettingsController.saveUserData({
                            first_name: state.user.first_name as string,
                            second_name: state.user.second_name as string,
                            display_name: state.user.display_name as string,
                            login: state.user.login as string,
                            email: state.user.email as string,
                            phone: state.user.phone as string,
                        }).then((response) => {
                            Store.set('isLoading', false);
                            if (response) {
                                const resp = JSON.parse(response.response)
                                if (response.status !== 200) {
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                Store.set('user', resp);
                                this.setProps({
                                    settings: {
                                        editProfile: false,
                                    }
                                })
                            }
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
    user: TUserDetails,
    settings: TSettings,
    isLoading: boolean,
} {
    return {
        user: state.user,
        settings: state.settings,
        isLoading: state.isLoading
    };
}

export default connect(mapUserToProps)(ProfilePage)