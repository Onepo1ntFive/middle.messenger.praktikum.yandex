import Block, { type Props } from '../../services/Block';
import template from './chatMenuItem.hbs?raw';
import { Indexed, TChatDetails, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';

interface chatMenuItemProps extends Props {
    deleteChatUser: (userId: number) => void,
    chatUsers: Array<TUserDetails>;

    [key: string]: unknown;
}

class ChatMenuItem extends Block {
    constructor(props: chatMenuItemProps) {
        super({
            ...props,
            events: {
                click: event => {
                    event.preventDefault();
                    const target = event.target as HTMLFormElement;
                    if (target.classList.contains('button')) {
                        props.deleteChatUser(this.props.id as number)
                    }
                }
            }
        });

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

export default connect(mapUserToProps)(ChatMenuItem)

export type TChatMenuItem = typeof ChatMenuItem;
