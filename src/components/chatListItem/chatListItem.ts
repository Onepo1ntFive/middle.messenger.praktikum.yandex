import Block, { type Props } from '../../services/Block';
import template from './chatListItem.hbs?raw';
import Store, { Indexed, TChatDetails, TSettings } from '../../services/Store';
import connect from '../../services/connectStore';

interface ChatListItemProps extends Props {
    onCurrentChatUpdate: () => void;

    [key: string]: unknown;
}

class ChatListItem extends Block {
    constructor(props: ChatListItemProps) {
        super({
            ...props,
            events: {
                click: () => {
                    Store.set('currentChat', {
                        id: props.id,
                        title: props.title,
                        avatar: props.avatar,
                        token: props.token,
                    })
                    Store.set('settings', {
                        currentChatId: props.id,
                    })
                    props.onCurrentChatUpdate();
                }
            },
        });
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    currentChat: TChatDetails | unknown,
    settings: TSettings | unknown,
} {
    return {
        currentChat: state.currentChat,
        settings: state.setting
    };
}

export default connect(mapUserToProps)(ChatListItem)
