import '../../styles/login.sass';
import Block, { type Props } from '../../services/Block';
import template from './registrationPage.hbs?raw';
import { Button, Form, Input, Link } from '../../components';
import { registrationFormData } from '../../demoData';

interface RegistrationPageProps extends Props {
    changePage: (page: string) => void;
}

export class RegistrationPage extends Block {
    constructor(props: RegistrationPageProps) {
        super({
            ...props,
            Form: new Form({
                formData: {...registrationFormData},
                inputs: [
                    new Input({
                        label: 'Почта',
                        id: 'email',
                        name: 'email',
                        type: 'text',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Логин',
                        id: 'login',
                        name: 'login',
                        type: 'text',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Имя',
                        id: 'first_name',
                        name: 'first_name',
                        type: 'text',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Фамилия',
                        id: 'second_name',
                        name: 'second_name',
                        type: 'text',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Телефон',
                        id: 'phone',
                        name: 'phone',
                        type: 'text',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Пароль',
                        id: 'password',
                        name: 'password',
                        type: 'password',
                        error: null, //false
                        value: '',
                    }),
                    new Input({
                        label: 'Пароль(ещё раз)',
                        id: 'password_repeat',
                        name: 'password_repeat',
                        type: 'password',
                        error: null, //false
                        value: '',
                    }),
                ],
                Link: new Link({
                    label: 'Войти',
                    href: '#',
                }),
                Button: new Button({
                    label: 'Зарегистрироваться',
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
