import Block, { type Props } from '../../services/Block';
import template from './chatList.hbs?raw';
import Store, { Indexed, TChatDetails, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';
import { ChatListItem } from '../chatListItem';
import isEqualArray from '../../helpers/isEqualArray';
import { TChatListItem } from '../chatListItem/chatListItem';

interface ChatListProps extends Props {
    chatItems: Array<TChatListItem>
    onCurrentChatUpdate: void;

    [key: string]: unknown;
}

class ChatList extends Block {
    constructor(props: ChatListProps) {
        super({
            ...props,
            chatsList: props.chatsList || [],
        });
    }

    private updateChatItems() {
        if (this.props.chatItems.length) {
            this.children.chatItems = this.props.chatItems.map((props: Props) => {
                    return new ChatListItem({
                        avatar: props.avatar ? `https://ya-praktikum.tech/api/v2/resources/${ props.avatar }`: '',
                        created_by: props.created_by,
                        id: props.id,
                        last_message: props.last_message,
                        title: props.title,
                        unread_count: props.unread_count,
                        active: props.active || false,
                        token: props.token,
                        onCurrentChatUpdate: this.props.onCurrentChatUpdate,
                    })
                }
            );
        }
    }

    protected componentDidUpdate(): boolean {
        const state = Store.getState()
        const props: Props = this.props
        if (isEqualArray(state.chats, props.chats)) {
            this.updateChatItems();
        }
        return true;
    }

    protected init() {
        this.updateChatItems();
        super.init();
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    user: TUserDetails,
    chats: TChatDetails[],
    isLoading: boolean,
} {
    return {
        user: state.user,
        chats: state.chats,
        isLoading: state.isLoading
    };
}

export default connect(mapUserToProps)(ChatList)
