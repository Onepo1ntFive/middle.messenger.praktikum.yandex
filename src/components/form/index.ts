import './index.sass'
import Block, { type Props } from '../../services/Block.ts';
import template from './form.hbs?raw';
import type { Input } from '../input';
import { type FieldName, FormValidator, validators } from '../../helpers/validation.ts';


interface FormProps extends Props {
    formData: Record<string, unknown>,
    inputs: Input[];
}

export class Form extends Block {
    constructor(props: FormProps) {
        const validator = new FormValidator();
        super({
            ...props,
            events: {
                submit: (event) => {
                    event.preventDefault();
                    const form = event.target as HTMLFormElement;
                    const formData = new FormData(form);
                    const fieldsForValidation = Array.from(formData.entries()).filter(([field,]) => validators[field as FieldName] !== undefined).map(([name, value]) => {
                        return {[name]: value}
                    });
                    const error = validator.validateForm(Object.fromEntries(fieldsForValidation.entries()) as Record<string, unknown>);
                    if (error) {
                        console.log('Ошибочки')
                    } else {
                        console.log('Сабмитимся')
                    }
                }
            },
        });
    }

    override render(): string {
        return template;
    }
}
