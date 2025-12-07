import Handlebars from 'handlebars';
import { chatList, loginFormData, profileData, registrationFormData } from './demoData.ts'
import * as Pages from './pages';
import * as Components from './components';

Handlebars.registerPartial('Avatar', Components.Avatar);
Handlebars.registerPartial('Input', Components.Input);
Handlebars.registerPartial('Button', Components.Button);
Handlebars.registerPartial('Link', Components.Link);
Handlebars.registerPartial('ChatListItem', Components.ChatListItem);
Handlebars.registerPartial('Form', Components.Form);


export default class App {
    private appElement: any;
    private state: { currentPage: string };

    constructor() {
        this.state = {
            currentPage: 'profile',
        };
        this.appElement = document.getElementById('app');
    }

    render() {
        let template;
        if (this.state.currentPage === 'login') {
            template = Handlebars.compile(Pages.LoginPage);
            this.appElement.innerHTML = template({
                formData: loginFormData,
            });
        }
        if (this.state.currentPage === 'register') {
            template = Handlebars.compile(Pages.RegistrationPage);
            this.appElement.innerHTML = template({
                formData: registrationFormData,
            });
        }
        if (this.state.currentPage === 'profile') {
            template = Handlebars.compile(Pages.ProfilePage);
            profileData.disabled = 1;
            this.appElement.innerHTML = template({
                profileData: profileData
            });
        }
        if (this.state.currentPage === 'profile_edit') {
            template = Handlebars.compile(Pages.ProfilePage);
            profileData.disabled = 0;
            this.appElement.innerHTML = template({
                profileData: profileData
            });
        }
        if (this.state.currentPage === 'profile_password') {
            template = Handlebars.compile(Pages.ProfilePagePassword);
            profileData.disabled = 0;
            this.appElement.innerHTML = template({
                profileData: profileData
            });
        }
        if (this.state.currentPage === 'error404') {
            template = Handlebars.compile(Pages.ErrorPage);
            this.appElement.innerHTML = template({
                errorData: {
                    errorCode: '404',
                    title: 'Не туда попали'
                },
            });
        }
        if (this.state.currentPage === 'error500') {
            template = Handlebars.compile(Pages.ErrorPage);
            this.appElement.innerHTML = template({
                errorData: {
                    errorCode: '500',
                    title: 'Мы уже фиксим'
                },
            });
        }
        if (this.state.currentPage === 'chat') {
            template = Handlebars.compile(Pages.ChatPage);
            this.appElement.innerHTML = template({
                chatList: chatList,
            });
        }
        this.attachEventListeners();
    }

    attachEventListeners() {
        const nav = document.querySelectorAll('[data-page]');
        nav.forEach(button => {
            button.addEventListener('click', (event: any) => {
                this.changePage(event.target?.dataset?.page);
            });
        });
    }

    changePage(page: string) {
        this.state.currentPage = page;
        this.render();
    }

}
