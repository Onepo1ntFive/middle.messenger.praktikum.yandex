import './index.sass'
import Block, { type Props } from '../../services/Block.ts';
import template from './input.hbs?raw';
import { type FieldName, FormValidator } from '../../helpers/validation.ts';

interface InputProps extends Props {
    type?: string,
    id?: string,
    class?: string,
    name?: string,
    value?: string,
    label?: string,
    disabled?: boolean,
    error?: null | string,
}

export class Input extends Block {
    constructor(props: InputProps) {
        const validator = new FormValidator();
        super({
            ...props,
            events: {
                blur: (event) => {
                    const input = event.target as HTMLInputElement;
                    if (props.name) {
                        const error = validator.validateField(props.name as FieldName, input.value);
                        console.log(error)
                        this.setProps({
                            ...props,
                            value: input.value,
                            error: error,
                        })
                    }
                },
            }
        });
    }

    override render(): string {
        return template;
    }
}
