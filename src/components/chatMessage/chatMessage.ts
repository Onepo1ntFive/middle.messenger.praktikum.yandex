import Block, { type Props } from '../../services/Block';
import template from './chatMessage.hbs?raw';
import { Indexed, TUserDetails } from '../../services/Store';
import connect from '../../services/connectStore';

interface ChatMessageProps extends Props {
    [key: string]: unknown;
}

class ChatMessage extends Block {
    constructor(props: ChatMessageProps) {
        super({
            ...props,
        });
    }

    override render(): string {
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

export default connect(mapUserToProps)(ChatMessage)

export type TChatMessage = typeof ChatMessage;
