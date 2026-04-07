import { FormValidator } from './validation';
import { Input } from '../components';

const validator = new FormValidator();

export function submitForm(event: Event, inputs: Input[]) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const formHasError = validator.validateForm(Object.fromEntries(formData.entries()));
    const errors = validator.getErrors();
    for (const input of inputs) {
        const inputProps = input.getProps()
        const inputName = inputProps.name;
        if (inputName && errors[`${inputName}`]) {
            input.setProps({
                ...inputProps,
                error: errors[`${inputName}`],
            })
        }
    }
    if (formHasError) {
        console.error('Ошибочки');
    } else {
        console.log('Сабмитимся');
    }
}