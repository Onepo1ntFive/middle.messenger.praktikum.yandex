import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './input.hbs?raw';
import { type FieldName, FormValidator, validators } from '../../helpers/validation';

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
                    if (!['message', 'newChatName'].includes(`${props.name}`)) {
                        const input = event.target as HTMLInputElement;
                        const fieldName = props.name as FieldName;
                        if (props.name && validators[`${fieldName}`]) {
                            const error = validator.validateField(fieldName, input.value);
                            this.setProps({
                                ...props,
                                value: input.value,
                                error: error,
                            })
                        }
                        else {
                            this.setProps({
                                ...props,
                                value: input.value,
                            })
                        }
                    }
                },
            }
        });
    }

    override render(): string {
        return template;
    }
}
