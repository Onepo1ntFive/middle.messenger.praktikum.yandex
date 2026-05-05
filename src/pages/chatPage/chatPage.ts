import './index.sass';
import Block, { type Props } from '../../services/Block';
import { Button, Input, Link } from '../../components';
import template from './chatPage.hbs?raw';
import { isFormValid } from '../../helpers/form';
import Router from '../../services/Router';
import { Routes } from '../../consts/consts';
import Store, { Indexed, TChatDetails, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';
import ChatController from '../../controller/ChatController';
import { ChatList } from '../../components/chatList';
import { ChatMenu } from '../../components/chatMenu';

interface ChatPageProps extends Props {
    ChatsList: Block;
    chatItems: TChatDetails[];
    currentChat: TChatDetails,
}

export class ChatPage extends Block {
    constructor(props: ChatPageProps) {
        super({
            ...props,
            ChatsList: new ChatList({
                chatItems: [],
                onCurrentChatUpdate: () => {
                    let state = Store.getState();
                    this.setProps({
                        currentChat: state.currentChat,
                        settings: {
                            currentChatId: state.settings.currentChatId,
                        }
                    })
                    for (const chatItem of this.children.ChatsList.children.chatItems as Block[]) {
                        chatItem.setProps({
                            active: chatItem.props.id === state.currentChat.id
                        })
                    }
                }
            }),
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
            InputNew: new Input({
                label: 'Новый чат',
                name: 'newChatName',
                id: 'newChatName',
                value: '',
            }),
            ChatMenu: new ChatMenu({
                menuActive: false,
            }),
            ButtonNew: new Button({
                type: 'button',
                label: 'Создать',
                class: 'button--add',
                events: {
                    click: () => {
                        this.setProps({
                            isLoading: true,
                        })
                        const title: string = this.children.InputNew.props.value;
                        ChatController.createChat({title: title}).then(async (response) => {
                            if (response.status !== 200) {
                                const resp = JSON.parse(response.response)
                                alert(`${ response.status }: ${ resp.reason }`);
                                return;
                            }
                            await ChatController.getChats().then((response) => {
                                this.setProps({
                                    isLoading: true,
                                })
                                updateChatList(response, this);
                                this.children.InputNew.props.value = '';
                            })
                        });
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

        Store.set('isLoading', true)
        ChatController.getChats().then((response: Response) => {
            this.setProps({
                isLoading: false,
            })
            Store.set('isLoading', false)
            if (response.status !== 200) {
                const resp = JSON.parse(response.response);
                alert(`${ response.status }: ${ resp.reason }`);
                return;
            }
            updateChatList(response, this);
        })
    }

    override render() {
        return template;
    }
}

function updateChatList(response: Response, block: Block) {
    if (response.status === 200) {
        const resp = JSON.parse(response.response);
        const chatList = block.children.ChatsList as Block;
        chatList.setProps({
            chatItems: [...resp],
        })
        Store.set('chats', resp)
    }
}

function mapUserToProps(state: Indexed): {
    user: TUserDetails,
    chats: TChatDetails[],
    currentChat: TChatDetails,
} {
    return {
        currentChat: state.currentChat,
        user: state.user,
        chats: state.chats,
    };
}

export default connect(mapUserToProps)(ChatPage)

export type TChatPage = typeof ChatPage;
