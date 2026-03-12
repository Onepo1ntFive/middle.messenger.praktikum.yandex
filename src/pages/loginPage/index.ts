import '../../styles/login.sass';
import Block, { type Props } from '../../services/Block';
import template from './loginPage.hbs?raw';
import { Button, Form, Input, Link } from '../../components';
import { loginFormData } from '../../demoData';

interface LoginPageProps extends Props {
    changePage: (page: string) => void;
}

export class LoginPage extends Block {
    constructor(props: LoginPageProps) {
        super({
            ...props,
            Form: new Form({
                formData: {...loginFormData},
                inputs: [
                    new Input({
                        id: 'login',
                        name: 'login',
                        label: 'Логин',
                        type: 'text',
                        error: null,
                    }),
                    new Input({
                        id: 'password',
                        name: 'password',
                        label: 'Пароль',
                        type: 'password',
                        error: null,
                    }),
                ],
                Link: new Link({
                    label: 'Нет аккаунта?',
                    href: '#',
                }),
                Button: new Button({
                    label: 'Авторизоваться',
                    type: 'submit',
                }),
            }),
        })
        ;
    }

    override render() {
        return template;
    }
}
