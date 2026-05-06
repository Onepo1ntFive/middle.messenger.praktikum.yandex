import Block, { type Props } from '../../services/Block';
import template from './chatMenu.hbs?raw';
import Store, { Indexed, TChatDetails } from '../../services/Store';
import connect from '../../services/connectStore';
import { Button } from '../button';
import ChatController from '../../controller/ChatController';
import { Input } from '../input';
import { TChatMenuItem } from '../chatMenuItem/chatMenuItem';
import isEqualArray from '../../helpers/isEqualArray';
import { ChatMenuItem } from '../chatMenuItem';

interface ChatListItemProps extends Props {
    chatUsers: TChatMenuItem[];
    menuActive: boolean,

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
                        const input = this.children.AddUserInput;
                        const userId = Number(input.props.value);
                        if (state.currentChat) {
                            ChatController.addChatUser({
                                users: [
                                    userId,
                                ],
                                chatId: state.currentChat.id,
                            }).then((response) => {
                                if (response.status !== 200) {
                                    alert(`${ response.status }`);
                                    return;
                                }
                                this.getChatUsers().then(() => {
                                    this.updateChatMenuItems();
                                });
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
        await ChatController.getChatUsers(state.currentChat.id).then((response: Response) => {
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
        })
    }

    private updateChatMenuItems() {
        if (this.props.chatUsers) {
            this.children.chatUsers = this.props.chatUsers?.map((props: Props) => {
                    return new ChatMenuItem({
                        ...props,
                        deleteChatUser: (userId: number) => {
                            const state = Store.getState();
                            ChatController.deleteChatUser({
                                users: [
                                    userId,
                                ],
                                chatId: state.currentChat.id,
                            }).then(response => {
                                if (response.status !== 200) {
                                    const resp = JSON.parse(response.response)
                                    alert(`${ response.status }: ${ resp.reason }`);
                                    return;
                                }
                                this.getChatUsers().then(() => {
                                    this.updateChatMenuItems();
                                })
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
        const props: ChatListItemProps = this.props;
        if (isEqualArray(state.currentChat.chatUsers, props.chatUsers)) {
            this.updateChatMenuItems();
        }
        return true;
    }

    protected init() {
        this.updateChatMenuItems();
        super.init();
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    currentChat: TChatDetails,
} {
    return {
        currentChat: state.currentChat,
    };
}

export default connect(mapUserToProps)(ChatMenu)

export type TChatListItem = typeof ChatMenu;
