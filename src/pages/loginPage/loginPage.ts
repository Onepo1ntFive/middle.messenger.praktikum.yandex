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
import Store, { IState } from '../../services/Store';
import connect from '../../services/connectStore';
import { IResponse, IResponseAdd } from '../../api/HTTPTransport';

interface LoginPageProps extends Props {
    [key: string]: unknown;
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
                        event.preventDefault();
                        const form = event.target as EventTarget;
                        if (isFormValid(form as HTMLFormElement, inputs)) {
                            Store.set('isLoading', true);
                            const formData: ISignInRequestData = {
                                login: '',
                                password: '',
                            };
                            for (const item of form as HTMLFormElement) {
                                const formItem = item as HTMLFormElement;
                                if (formItem.name as keyof ISignInRequestData in formData) {
                                    formData[formItem.name as keyof ISignInRequestData] = formItem.value;
                                }
                            }
                            AuthController.signIn(formData).then(async (response: IResponse<IResponseAdd>) => {
                                if (response.status !== 200) {
                                    Store.set('isLoading', false);
                                    const resp = JSON.parse(response.response)
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                await AuthController.getUser().then((response: IResponse<IResponseAdd>) => {
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
                                }).catch(error => {
                                    Store.set('isLoading', false);
                                    console.warn(error)
                                });
                            }).catch(error => {
                                Store.set('isLoading', false);
                                console.warn(error)
                            });
                        }
                    }
                }
            }),
        })
    }

    override render() {
        return template;
    }
}

function mapUserToProps(state: IState): {
    isLoading: boolean | unknown,
} {
    return {
        isLoading: state.isLoading
    };
}

export default connect(mapUserToProps)(LoginPage)

export type TLoginPage = typeof LoginPage;
