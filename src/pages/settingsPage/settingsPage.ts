import './index.sass';
import '../../components/loader/index.sass';
import Block, { Props } from '../../services/Block';
import template from './settingsPage.hbs?raw';
import connect from '../../services/connectStore';
import { Indexed, TSettings, TUserDetails } from '../../services/Store';
import { ProfilePage } from '../profilePage';
import { PasswordPage } from '../passwordPage';
import { Button } from '../../components';
import Router from '../../services/Router';
import { Routes } from '../../consts/consts';

interface SettingsPageProps extends Props {
    [key: string]: unknown;
}

class SettingsPage extends Block {
    constructor(props: SettingsPageProps) {
        super({
            ...props,
            ButtonBack: new Button({
                label: 'Назад',
                type: 'button',
                class: 'page-profile_back',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        Router.go(Routes.MESSENGER);
                    }
                }
            }),
            profilePage: new ProfilePage({
                onRouteEditPassword: () => {
                    this.setProps({
                        ...this.props,
                        settings: {
                            showProfile: false,
                            editProfile: false,
                            showPassword: true,
                        }
                    });
                },
            }),
            passwordPage: new PasswordPage({
                onRouteShowProfile: () => {
                    this.setProps({
                        ...this.props,
                        settings: {
                            showProfile: true,
                            editProfile: false,
                            showPassword: false,
                        }
                    });
                },
            }),
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

export default connect(mapUserToProps)(SettingsPage)

export type TSettingsPage = typeof SettingsPage;
