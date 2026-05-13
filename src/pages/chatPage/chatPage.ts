import './index.sass';
import Block, { type Props } from '../../services/Block';
import { Button, Input, Link } from '../../components';
import template from './chatPage.hbs?raw';
import { isFormValid } from '../../helpers/form';
import Router from '../../services/Router';
import { IEvent, Routes, WS_BASE_URL } from '../../consts/consts';
import Store, { IState, TChatDetails, TCurrentChat, TMessage, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';
import ChatController from '../../controller/ChatController';
import { ChatList } from '../../components/chatList';
import { ChatMenu } from '../../components/chatMenu';
import deepArrayMerge from '../../helpers/deepArrayMerge';
import { ChatMessage } from '../../components/chatMessage';
import parseMessageTime from '../../helpers/parseMessageTime';
import { IResponse, IResponseAdd } from '../../api/HTTPTransport';

interface ChatPageProps extends Props {
    [key: string]: unknown;
}

class ChatPage extends Block {
    socket: WebSocket | undefined;

    constructor(props: ChatPageProps) {
        super({
            ...props,
            ChatsList: new ChatList({
                chatItems: [],
                onCurrentChatUpdate: () => {
                    const state = Store.getState();
                    this.setProps({
                        currentChat: state.currentChat,
                    })
                    this.initWebSocket();
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
                    submit: (event: Event) => {
                        if (event.target) {
                            const eventTarget = event.target as IEvent;
                            const form = eventTarget.form;
                            isFormValid(form, [this.children.InputSearch as Input])
                        }
                    }
                }
            }),
            InputNew: new Input({
                label: 'Новый чат',
                name: 'newChatName',
                id: 'newChatName',
            }),
            ChatMenu: new ChatMenu({
                menuActive: false,
                onChatDelete: (chatId: number) => {
                    Store.set('currentChat', {
                        id: null,
                        chatUsers: [],
                        messages: [],
                        token: null,
                    })
                    this.setProps({
                        currentChat: {
                            id: null,
                            chatUsers: [],
                            messages: [],
                            token: null,
                        }
                    })
                    const state = Store.getState();
                    updateChatList(state.chats.filter(el => el.id !== chatId), this)
                }
            }),
            ButtonNew: new Button({
                type: 'submit',
                label: 'Создать',
                class: 'button--add',
                events: {
                    click: (event) => {
                        event.preventDefault();

                        const eventTarget = event.target as IEvent;
                        const form = eventTarget.form;
                        const formInput = form[0] as HTMLFormElement

                        if (!formInput.value.length) {
                            alert('Имя чата не может быть пустым');
                            return;
                        }
                        this.setProps({
                            isLoading: true,
                        })
                        Store.set('isLoading', true)
                        ChatController.createChat({title: formInput.value as string}).then((response: IResponse<IResponseAdd>) => {
                            if (response.status !== 200) {
                                const resp = JSON.parse(response.response)
                                alert(`${ response.status }: ${ resp.reason }`);
                                return;
                            }
                            ChatController.getChats().then(async (response: IResponse<IResponseAdd>) => {
                                const resp = JSON.parse(response.response);
                                for (const respElement of resp) {
                                    await ChatController.getChatToken(respElement.id).then((tokenResponse: IResponse<IResponseAdd>) => {
                                        if (tokenResponse.status !== 200) {
                                            const resp = JSON.parse(tokenResponse.response);
                                            alert(`${ tokenResponse.status }: ${ resp.reason }`);
                                            return;
                                        }
                                        if (tokenResponse.status === 200) {
                                            const tokenResp = JSON.parse(tokenResponse.response);
                                            respElement.token = tokenResp.token
                                        }
                                    }).catch(error => {
                                        console.warn(error)
                                    })
                                }
                                this.setProps({
                                    isLoading: false,
                                })
                                Store.set('isLoading', false)
                                updateChatList(resp, this);
                            }).catch(error => {
                                console.warn(error)
                            })
                            formInput.value = '';
                        }).catch(error => {
                            console.warn(error)
                        });
                    }
                }
            }),
            Button: new Button({
                type: 'submit',
                label: 'Отправить',
                class: 'button--arrow',
                events: {
                    click: (event: Event) => {
                        event.preventDefault();
                        const inputComponent = this.children.Input as Input;
                        this.submitMessage(event, inputComponent);
                    }
                }
            }),
            Link: new Link({
                label: 'Профиль',
                class: 'link--gray link--chevron',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        this.setProps({
                            settings: {
                                showProfile: true,
                                editProfile: false,
                                showPassword: false,
                            }
                        })
                        Store.set('settings.showProfile', true);
                        Store.set('settings.editProfile', false);
                        Store.set('settings.showPassword', false);
                        Router.go(Routes.PROFILE);
                    }
                }
            }),
        });

        Store.set('isLoading', true)
        ChatController.getChats().then(async (response: IResponse<IResponseAdd>) => {
            if (response.status !== 200) {
                const resp = JSON.parse(response.response);
                alert(`${ response.status }: ${ resp.reason }`);
                return;
            }
            if (response.status === 200) {
                const resp = JSON.parse(response.response);
                for (const respElement of resp) {
                    await ChatController.getChatToken(respElement.id).then((tokenResponse: IResponse<IResponseAdd>) => {
                        if (tokenResponse.status !== 200) {
                            const resp = JSON.parse(tokenResponse.response);
                            alert(`${ tokenResponse.status }: ${ resp.reason }`);
                            return;
                        }
                        if (tokenResponse.status === 200) {
                            const tokenResp = JSON.parse(tokenResponse.response);
                            respElement.token = tokenResp.token
                        }
                    }).catch(error => {
                        console.warn(error)
                    })
                }
                updateChatList(resp, this);
            }
            this.setProps({
                isLoading: false,
            })
            Store.set('isLoading', false)
        }).catch(error => {
            console.warn(error)
        })
    }

    private submitMessage(event: Event, inputComponent: Input) {
        const eventTarget = event.target as IEvent;
        const form = eventTarget.form;
        const formInput = form[0] as HTMLFormElement
        if (!formInput.value) {
            inputComponent.setProps({
                error: 'Поле не должно быть пустым'
            })
            return
        }
        if (eventTarget.form) {
            this.socket?.send(
                JSON.stringify({
                    content: formInput.value,
                    type: 'message',
                })
            );
            inputComponent.setProps({
                error: null,
                value: '',
            })
        }
    }

    private getOldMessages(formId: number) {
        this.socket?.send(
            JSON.stringify({
                content: `${ formId }`,
                type: 'get old',
            })
        );
    }

    private async getChatUsers() {
        const state = Store.getState();
        const currentChat = state.currentChat as TCurrentChat
        await ChatController.getChatUsers(currentChat.id as number).then((response: IResponse<IResponseAdd>) => {
            if (response.status !== 200) {
                alert(`${ response.status }`);
                return;
            }
            const resp = JSON.parse(response.response)
            Store.set('currentChat.chatUsers', resp);
            this.setProps({
                chatUsers: resp,
            })
        }).catch(error => {
            console.warn(error)
        })
    }

    private updateChatMessages() {
        const state: IState = Store.getState();
        const currentChat = this.props.currentChat as TCurrentChat;
        if (currentChat && currentChat.id) {
            const messages = currentChat.messages?.map((props: Props) => {
                    const date = parseMessageTime(props.time as string);
                    const message_user = state.currentChat.chatUsers.find(el => el.id === props.user_id);
                    return new ChatMessage({
                        ...props,
                        message_time: date ? date.time : '',
                        message_date: date ? date.date : '',
                        is_me: state.user?.id === props.user_id,
                        message_user: message_user,
                        type_info: props.type === 'user connected',
                    })
                }
            );
            this.children.chatMessages = messages
            this.setProps({
                chatMessages: messages
            });
        }
    }

    private initWebSocket() {
        const state: IState = Store.getState();
        this.socket = new WebSocket(
            `${ WS_BASE_URL }${ state.user?.id }/${ state.currentChat.id }/${ state.currentChat.token }`
        );

        this.socket.addEventListener('open', () => {
            console.log('Соединение установлено');
            this.getOldMessages(0);
        });

        this.socket.addEventListener('message', async (event) => {
            const mess: TMessage[] | TMessage = JSON.parse(event.data);
            const props = this.props as ChatPageProps;
            const currentChat = props.currentChat as TCurrentChat;
            if (Array.isArray(mess)) {
                const messages = deepArrayMerge(currentChat.messages.reverse(), mess);
                this.setProps({
                    currentChat: {
                        ...currentChat,
                        messages: messages.sort((a: TMessage, b: TMessage) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime())
                    }
                })
            } else {
                const messages = deepArrayMerge(currentChat.messages.reverse(), [mess]) as TMessage[];
                Store.set('currentChat.messages', messages);
                this.setProps({
                    currentChat: {
                        ...currentChat,
                        messages: messages.sort((a, b) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime())
                    }
                })
            }
            await this.getChatUsers();
            this.updateChatMessages();
        });

        this.socket.addEventListener('close', (event) => {
            if (event.wasClean) {
                console.log('Соединение закрыто чисто');
            } else {
                console.log('Обрыв соединения');
            }

            console.log(`${ event.code }: ${ event.reason }`);
        });
    }

    override render() {
        return template;
    }
}

function updateChatList(chats: Array<TChatDetails>, block: Block) {
    const chatList = block.children.ChatsList as Block;
    Store.set('chats', chats)
    chatList.setProps({
        chatItems: chats,
    })
}

function mapUserToProps(state: IState): {
    newChatName: string | unknown,
    user: TUserDetails | unknown,
    chats: TChatDetails[] | unknown,
    currentChat: TChatDetails | unknown,
} {
    return {
        newChatName: state.newChatName,
        user: state.user,
        chats: state.chats,
        currentChat: state.currentChat,
    };
}

export default connect(mapUserToProps)(ChatPage)

export type TChatPage = typeof ChatPage;
