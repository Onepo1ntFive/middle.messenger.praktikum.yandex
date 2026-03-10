import './index.sass'
import Block, { type Props } from '../../services/Block.ts';
import template from './form.hbs?raw';
import type { Input } from '../input';


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
                    event.preventDefault();
                    const form = event.target as HTMLFormElement;
                    const formData = new FormData(form);

                    console.log(Object.fromEntries(formData.entries()));
                }
            },
        });
    }

    override render(): string {
        return template;
    }
}