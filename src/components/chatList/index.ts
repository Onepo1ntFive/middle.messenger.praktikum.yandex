import Block, { type Props } from '../../services/Block.ts';

import template from './chatListItem.hbs?raw';


interface ChatListItemProps extends Props {
    id?: string;
    date?: string;
    time?: string;
    title?: string;
    message?: string;
    unread?: number;
    lastMe?: boolean;
    active?: boolean;
}

export class ChatListItem extends Block {
    constructor(props: ChatListItemProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}
