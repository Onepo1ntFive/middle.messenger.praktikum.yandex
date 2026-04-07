import './index.sass';
import Block, { type Props } from '../../services/Block';
import template from './profilePage.hbs?raw';
import { Avatar, Button, Input, Link } from '../../components';
import { profileData } from '../../demoData';
import { submitForm } from '../../helpers/form';

export { default as ProfilePagePassword } from './profilePagePassword.hbs?raw';

interface ProfilePageProps extends Props {
    changePage: (page: string) => void;
}

export class ProfilePage extends Block {
    constructor(props: ProfilePageProps) {
        const profileInputs: Input[] = [
            new Input({
                label: 'Почта',
                value: profileData.email,
                type: 'text',
                name: 'email',
                id: 'email',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Логин',
                value: profileData.login,
                type: 'text',
                name: 'login',
                id: 'login',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Имя',
                value: profileData.first_name,
                type: 'text',
                name: 'first_name',
                id: 'first_name',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Фамилия',
                value: profileData.second_name,
                type: 'text',
                name: 'second_name',
                id: 'second_name',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Имя в чате',
                value: profileData.display_name,
                type: 'text',
                name: 'display_name',
                id: 'display_name',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Телефон',
                value: profileData.phone,
                type: 'text',
                name: 'phone',
                id: 'phone',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
        ];
        const passwordInputs: Input[] = [
            new Input({
                label: 'Старый пароль',
                type: 'password',
                name: 'oldPassword',
                id: 'oldPassword',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Новый пароль',
                type: 'password',
                name: 'newPassword',
                id: 'newPassword',
                disabled: props.disabled as boolean,
                class: 'input--clear',
                error: null,
            }),
            new Input({
                label: 'Новый пароль (повтор)',
                type: 'password',
                name: 'newPasswordRepeat',
                id: 'newPasswordRepeat',
                disabled: props.disabled as boolean,
                class: 'input--clear',
            }),
        ];

        const buttons =
            props.view === 'profile' ?
                {
                    LinkEdit: new Link({
                        label: 'Изменить данные'
                    }),
                    LinkPassword: new Link({
                        label: 'Изменить пароль'
                    }),
                    LinkLogout: new Link({
                        label: 'Выйти',
                        class: 'link--red',
                    }),
                    Button: new Button({
                        label: 'Сохранить',
                        type: 'submit',
                    }),
                } : {
                    Button: new Button({
                        label: 'Сохранить',
                        type: 'submit',
                    }),
                }

        super({
            ...props,
            ...buttons,
            profileData: profileData,
            Avatar: new Avatar({}),
            inputs: props.view === 'profile' ? profileInputs : passwordInputs,
            events: {
                submit: (event) => {
                    submitForm(event, props.view === 'profile' ? profileInputs : passwordInputs)
                }
            },
        })
    }

    override render() {
        return template;
    }
}
