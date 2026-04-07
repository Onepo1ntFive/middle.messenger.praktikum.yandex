import './index.sass';
import Block, { type Props } from '../../services/Block';
import { Button, ChatListItem, Input, Link } from '../../components';
import template from './chatPage.hbs?raw';
import { chatList } from '../../demoData';
import { submitForm } from '../../helpers/form';


interface ChatPageProps extends Props {
    changePage: (page: string) => void;
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
                        submitForm(event, [this.children.InputSearch as Input])
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
            }),
            events: {
                submit: (event: Event) => {
                    submitForm(event, [this.children.Input as Input])
                }
            },
        });
    }

    override render() {
        return template;
    }
}
