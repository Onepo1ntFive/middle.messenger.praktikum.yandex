import '../../styles/login.sass';
import Block, { Props } from '../../services/Block';
import template from './registrationPage.hbs?raw';
import { Button, Form, Input, Link } from '../../components';
import { registrationFormData } from '../../demoData';
import { Routes } from '../../consts/consts';
import { isFormValid } from '../../helpers/form'
import AuthApi, { ISignUpRequestData } from '../../api/AuthApi';
import AuthController from '../../controller/AuthController';
import Router from '../../services/Router';
import Store, { Indexed } from '../../services/Store';
import connect from '../../services/connectStore';

interface RegistrationPageProps extends Props {
    [key: string]: unknown;
}

class RegistrationPage extends Block {
    constructor(props: RegistrationPageProps) {
        const inputs = [
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
        ];
        super({
            ...props,
            Form: new Form({
                formData: {...registrationFormData},
                inputs: inputs,
                Link: new Link({
                    label: 'Войти',
                    href: '#',
                    events: {
                        click: (event) => {
                            event.preventDefault();
                            Router.go(Routes.LOGIN);
                        }
                    }
                }),
                Button: new Button({
                    label: 'Зарегистрироваться',
                    type: 'submit',
                }),
                events: {
                    submit: (event) => {
                        Store.set('isLoading', true);
                        if (isFormValid(event, inputs)) {
                            const form = event.target as HTMLFormElement;
                            const formData: ISignUpRequestData = {
                                first_name: '',
                                second_name: '',
                                login: '',
                                phone: '',
                                email: '',
                                password: '',
                            };
                            for (const formItem of form) {
                                if (formItem.name as keyof ISignUpRequestData in formData) {
                                    formData[formItem.name as keyof ISignUpRequestData] = formItem.value;

                                }
                            }
                            AuthController.signUp(formData).then((response) => {
                                Store.set('isLoading', false);
                                if (response.status !== 200) {
                                    const resp = JSON.parse(response.response)
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                if (response.status === 200) {
                                    AuthApi.getUser();
                                    Router.go(Routes.LOGIN)
                                }
                            });
                        }
                    }
                }
            }),
        })
        ;
    }

    override render() {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    isLoading: boolean,
} {
    return {
        isLoading: state.isLoading
    };
}

export default connect(mapUserToProps)(RegistrationPage)

export type TRegistrationPage = typeof RegistrationPage;
