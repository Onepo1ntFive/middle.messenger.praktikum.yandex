import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './button.hbs?raw';

interface ButtonProps extends Props {
    label: string,
    type?: string,
    class?: string,
}

export class Button extends Block {
    constructor(props: ButtonProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}
