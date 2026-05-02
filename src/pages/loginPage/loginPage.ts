import '../../styles/login.sass';
import Block, { type Props } from '../../services/Block';
import template from './loginPage.hbs?raw';
import { Button, Form, Input, Link } from '../../components';
import { loginFormData } from '../../demoData';
import { Routes } from '../../consts/consts';
import { isFormValid } from '../../helpers/form';
import { ISignInRequestData } from '../../api/AuthApi';
import AuthController from '../../controller/AuthController';
import Router from '../../services/Router';
import Store, { Indexed } from '../../services/Store';
import connect from '../../services/connectStore';

interface LoginPageProps extends Props {
}

class LoginPage extends Block {
    constructor(props: LoginPageProps) {
        const inputs = [
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
        ];
        super({
            ...props,
            Form: new Form({
                formData: {...loginFormData},
                inputs: inputs,
                Link: new Link({
                    label: 'Нет аккаунта?',
                    href: '#',
                    events: {
                        click: (event) => {
                            event.preventDefault();
                            Router.go(Routes.REGISTER)
                        }
                    }
                }),
                Button: new Button({
                    label: 'Авторизоваться',
                    type: 'submit',
                }),
                events: {
                    submit: (event) => {
                        Store.set('isLoading', true);
                        if (isFormValid(event, inputs)) {
                            const form = event.target as HTMLFormElement;
                            const formData: ISignInRequestData = {
                                login: '',
                                password: '',
                            };
                            for (const item of form) {
                                const formItem = item as HTMLFormElement;
                                if (formItem.name as keyof ISignInRequestData in formData) {
                                    formData[formItem.name as keyof ISignInRequestData] = formItem.value;

                                }
                            }
                            AuthController.signIn(formData).then((response) => {
                                if (response.status !== 200) {
                                    const resp = JSON.parse(response.response)
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                AuthController.getUser().then((response) => {
                                    Store.set('isLoading', false);
                                    if (response.status !== 200) {
                                        const resp = JSON.parse(response.response)
                                        alert(`${ response.status }: ${ resp.reason }`);
                                        return;
                                    }
                                    if (response && response.status === 200) {
                                        const userInfo = JSON.parse(response.responseText);
                                        Store.set('isAuthenticated', true);
                                        Store.set('user', userInfo);
                                        if (window.location.pathname === Routes.LOGIN || window.location.pathname === Routes.REGISTER) {
                                            Router.go(Routes.MESSENGER);
                                        }
                                    }
                                });
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

export default connect(mapUserToProps)(LoginPage)

export type TLoginPage = typeof LoginPage;
