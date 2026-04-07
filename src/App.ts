import * as Pages from './pages'

interface appState {
    currentPage: string;

    [key: string]: unknown
}

export default class App {
    private readonly appElement: HTMLElement | null;
    private state: appState;

    constructor() {
        this.state = {
            currentPage: 'login',
        };
        this.appElement = document.getElementById('app');
    }

    render(): void {
        if (!this.appElement) return;
        if (this.state.currentPage === 'login') {
            const loginPage = new Pages.LoginPage({
                changePage: this.changePage,
            });
            this.appElement.replaceChildren(loginPage.getContent());
        }
        if (this.state.currentPage === 'register') {
            const RegistrationPage = new Pages.RegistrationPage({
                changePage: this.changePage,
            });
            this.appElement.replaceChildren(RegistrationPage.getContent());
        }
        if (this.state.currentPage === 'profile') {
            const ProfilePage = new Pages.ProfilePage({
                changePage: this.changePage,
                view: 'profile',
                disabled: true
            });
            this.appElement.replaceChildren(ProfilePage.getContent());
        }
        if (this.state.currentPage === 'profile_edit') {
            const ProfilePage = new Pages.ProfilePage({
                changePage: this.changePage,
                view: 'profile',
                disabled: false
            });
            this.appElement.replaceChildren(ProfilePage.getContent());
        }

        if (this.state.currentPage === 'profile_password') {
            const ProfilePage = new Pages.ProfilePage({
                changePage: this.changePage,
                view: 'password',
                disabled: false
            });
            this.appElement.replaceChildren(ProfilePage.getContent());
        }
        if (this.state.currentPage === 'error404') {
            const ErrorPage = new Pages.ErrorPage({
                changePage: this.changePage,
                linkLabel: 'Назад к чатам',
                title: 'Не туда попали',
                errorCode: '404',
            });
            this.appElement.replaceChildren(ErrorPage.getContent());
        }
        if (this.state.currentPage === 'error500') {
            const ErrorPage = new Pages.ErrorPage({
                changePage: this.changePage,
                linkLabel: 'Назад к чатам',
                title: 'Что то пошло не так',
                errorCode: '500',
            });
            this.appElement.replaceChildren(ErrorPage.getContent());
        }
        if (this.state.currentPage === 'chat') {
            const ChatPage = new Pages.ChatPage({
                changePage: this.changePage,
            });
            this.appElement.replaceChildren(ChatPage.getContent());
        }

        this.attachEventListeners();
    }

    attachEventListeners() {
        const nav = document.querySelectorAll('[data-page]');
        nav.forEach(button => {
            button.addEventListener('click', (event: Event) => {
                const target = event.target as HTMLElement;
                this.changePage(target.dataset?.page);
            });
        });
    }

    changePage(page: string | undefined) {
        if (!page) {
            return
        }
        this.state.currentPage = page;
        this.render();
    }

}
