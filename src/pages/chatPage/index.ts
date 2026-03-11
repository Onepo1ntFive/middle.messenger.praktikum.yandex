import './index.sass';
import Block, { type Props } from '../../services/Block.ts';
import { Button, ChatListItem, Input, Link } from '../../components';
import template from './chatPage.hbs?raw';
import { chatList } from '../../demoData.ts';
import { type FieldName, FormValidator, validators } from '../../helpers/validation.ts';


interface ChatPageProps extends Props {
    changePage: (page: string) => void;
}

export class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        const validator = new FormValidator();
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
                        event.preventDefault();
                        const form = event.target as HTMLFormElement;
                        const formData = new FormData(form);

                        console.log(Object.fromEntries(formData.entries()));
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
                submit: (event) => {
                    event.preventDefault();
                    const form = event.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const fieldsForValidation = Array.from(formData.entries()).filter(([field,]) => validators[field as FieldName] !== undefined).map(([name, value]) => {
                        return {[name]: value}
                    });
                    const error = validator.validateForm(Object.fromEntries(fieldsForValidation.entries()) as Record<string, unknown>);
                    if (error) {
                        console.log('Ошибочки')
                    } else {
                        console.log('Сабмитимся')
                    }
                }
            },
        });
    }

    override render() {
        return template;
    }
}