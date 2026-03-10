import './index.sass'
import Block, { type Props } from '../../services/Block.ts';
import template from './input.hbs?raw';

interface InputProps extends Props {
    type?: string,
    id?: string,
    class?: string,
    name?: string,
    value?: string,
    label?: string,
    disabled?: boolean,
}

export class Input extends Block {
    constructor(props: InputProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}