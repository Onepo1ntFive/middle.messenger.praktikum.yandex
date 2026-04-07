import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './avatar.hbs?raw';

interface AvatarProps extends Props {
    avatarSrc?: string | null,
}

export class Avatar extends Block {
    constructor(props: AvatarProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}
