import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './form.hbs?raw';
import type { Input } from '../input';
import { submitForm } from '../../helpers/form';


interface FormProps extends Props {
    formData: Record<string, unknown>,
    inputs: Input[];
}

export class Form extends Block {
    constructor(props: FormProps) {
        super({
            ...props,
            events: {
                submit: (event) => {
                    submitForm(event, props.inputs)
                }
            },
        });
    }

    override render(): string {
        return template;
    }
}
