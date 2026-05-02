import './index.sass';
import Block, { type Props } from '../../services/Block';
import { Button, ChatListItem, Input, Link } from '../../components';
import template from './chatPage.hbs?raw';
import { chatList } from '../../demoData';
import { isFormValid } from '../../helpers/form';
import Router from '../../services/Router';
import { Routes } from '../../consts/consts';
import { Indexed, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';

interface ChatPageProps extends Props {
}

export class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        const chatListItems = chatList.map((el) => {
            return new ChatListItem({
                id: el.id,
                date: el.date,
                time: el.time,
                title: el.title,
                message: el.message,
                unread: el.unread,
                lastMe: el.lastMe,
                active: el.active,
            })
        })

        super({
            ...props,
            chatListItems: chatListItems,
            Input: new Input({
                label: 'Сообщение',
                name: 'message',
                id: 'message',
                class: 'input--message',
            }),
            InputSearch: new Input({
                label: 'Поиск',
                name: 'search',
                id: 'search',
                class: 'input--search',
                events: {
                    submit: (event) => {
                        isFormValid(event, [this.children.InputSearch as Input])
                    }
                }
            }),
            Button: new Button({
                type: 'submit',
                label: 'Отправить',
                class: 'button--arrow'
            }),
            Link: new Link({
                label: 'Профиль',
                class: 'link--gray link--chevron',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        Router.go(Routes.PROFILE);
                    }
                }
            }),
            events: {
                submit: (event: Event) => {
                    isFormValid(event, [this.children.Input as Input])
                }
            },
        });
    }

    override render() {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    user: TUserDetails,
} {
    return {
        user: state.user,
    };
}

export default connect(mapUserToProps)(ChatPage)

export type TChatPage = typeof ChatPage;
