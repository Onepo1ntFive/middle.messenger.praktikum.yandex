import { FormValidator } from './validation';
import { Input } from '../components';

const validator = new FormValidator();

export function isFormValid(form: HTMLFormElement, inputs: Input[]) {
    const formData = new FormData(form);
    const formHasError = validator.validateForm(Object.fromEntries(formData.entries()));
    const errors = validator.getErrors();
    for (const input of inputs) {
        const inputProps = input.getProps()
        const inputName = inputProps.name;
        if (inputName && errors[`${ inputName }`]) {
            input.setProps({
                ...inputProps,
                error: errors[`${ inputName }`],
            })
        }
    }
    return !formHasError;
}
