import Block, { type Props } from '../../services/Block';
import template from './chatMenu.hbs?raw';
import Store, { IState, TChatDetails, TCurrentChat } from '../../services/Store';
import connect from '../../services/connectStore';
import { Button } from '../button';
import ChatController from '../../controller/ChatController';
import { Input } from '../input';
import { TChatMenuItem } from '../chatMenuItem/chatMenuItem';
import isEqualArray from '../../helpers/isEqualArray';
import { ChatMenuItem } from '../chatMenuItem';
import { IResponse, IResponseAdd } from '../../api/HTTPTransport';

interface ChatListItemProps extends Props {
    chatUsers: Array<TChatMenuItem>;
    menuActive: boolean;
    onChatDelete: (chatId: number) => void;

    [key: string]: unknown;
}

class ChatMenu extends Block {
    constructor(props: ChatListItemProps) {
        super({
            ...props,
            AddUserButton: new Button({
                type: 'button',
                label: 'Добавить пользователя',
                class: 'button--add button--add-small',
                events: {
                    click: () => {
                        const state = Store.getState();
                        const input = this.children.AddUserInput as Input;
                        const userId = Number(input.props.value);
                        if (state.currentChat) {
                            ChatController.addChatUser({
                                users: [
                                    userId,
                                ],
                                chatId: state.currentChat.id as number,
                            }).then((response: IResponse<IResponseAdd>) => {
                                if (response.status !== 200) {
                                    alert(`${ response.status }`);
                                    return;
                                }
                                this.getChatUsers().then(() => {
                                    this.updateChatMenuItems();
                                });
                            }).catch(error => {
                                console.warn(error)
                            })
                        }
                    }
                }
            }),
            DeleteChat: new Button({
                type: 'button',
                label: 'Удалить чат!?',
                class: 'button--warn',
                events: {
                    click: () => {
                        const state = Store.getState();
                        if (state.currentChat) {
                            const chatId = Number(state.currentChat.id);
                            ChatController.deleteChat(chatId).then((response: IResponse<IResponseAdd>) => {
                                if (response.status !== 200) {
                                    alert(`${ response.status }`);
                                    return;
                                }
                                this.setProps({
                                    menuActive: false,
                                })
                                props.onChatDelete(chatId);
                            }).catch(error => {
                                console.warn(error)
                            })
                        }
                    }
                }
            }),
            AddUserInput: new Input({
                label: 'ID пользователя',
                name: 'addUserId',
                id: 'addUserId',
                value: '',
                events: {
                    blur: event => {
                        console.log('blur')
                        event.preventDefault();
                    },
                }
            }),
            MenuButton: new Button({
                type: 'button',
                label: 'Меню',
                class: 'button--menu',
                events: {
                    click: async () => {
                        await this.getChatUsers();
                        this.setProps({
                            menuActive: !this.props.menuActive,
                        })
                    }
                },
            }),
        });

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
            this.updateChatMenuItems();
            Store.set('currentChat.chatUsers', resp);
            this.setProps({
                chatUsers: resp,
            })
        }).catch(error => {
            console.warn(error)
        })
    }

    private updateChatMenuItems() {
        if (this.props.chatUsers) {
            const chatUsers = this.props.chatUsers as Array<TChatMenuItem>;
            this.children.chatUsers = chatUsers.map((props: TChatMenuItem) => {
                    return new ChatMenuItem({
                        ...props,
                        deleteChatUser: (userId: number) => {
                            const state = Store.getState();
                            ChatController.deleteChatUser({
                                users: [
                                    userId,
                                ],
                                chatId: state.currentChat.id as number,
                            }).then((response: IResponse<IResponseAdd>) => {
                                if (response.status !== 200) {
                                    const resp = JSON.parse(response.response)
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                this.getChatUsers().then(() => {
                                    this.updateChatMenuItems();
                                }).catch(error => {
                                    console.warn(error)
                                })
                            }).catch(error => {
                                console.warn(error)
                            })
                        },
                        deleteButton: new Button({
                            label: 'Удалить',
                            class: 'button--delete',
                        })
                    })
                }
            );
        }
    }

    protected componentDidUpdate(): boolean {
        const state = Store.getState()
        const props = this.props as ChatListItemProps;
        if (isEqualArray(state.currentChat.chatUsers, props.chatUsers)) {
            this.updateChatMenuItems();
        }
        return super.componentDidUpdate();
    }

    protected init() {
        this.updateChatMenuItems();
        super.init();
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: IState): {
    currentChat: TChatDetails | unknown,
} {
    return {
        currentChat: state.currentChat,
    };
}

export default connect(mapUserToProps)(ChatMenu)
