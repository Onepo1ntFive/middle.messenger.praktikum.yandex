import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './form.hbs?raw';
import type { Input } from '../input';

interface FormProps extends Props {
    formData: Record<string, unknown>,
    inputs: Input[];
}

export class Form extends Block {
    constructor(props: FormProps) {
        super({
            ...props
        });
    }

    override render(): string {
        return template;
    }
}
