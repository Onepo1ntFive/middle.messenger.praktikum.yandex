import './index.sass'
import Block, { type Props } from '../../services/Block.ts';
import template from './link.hbs?raw';


interface LabelProps extends Props {
    href?: string,
    label?: string,
    class?: string,
}

export class Link extends Block {
    constructor(props: LabelProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}