export const validators = {
    first_name: (value: string): string | null => {
        const regex = /^[A-ZА-Я][a-zа-я-]*$/;
        return regex.test(value) ? null : 'Допускается латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).';
    },
    second_name: (value: string): string | null => {
        const regex = /^[A-ZА-Я][a-zа-я-]*$/;
        return regex.test(value) ? null : 'Допускается латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).';
    },
    login: (value: string): string | null => {
        const regex = /^[a-zA-Z][a-zA-z-_0-9]{2,19}$/;
        return regex.test(value) ? null : 'Допускается от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).';
    },
    email: (value: string): string | null => {
        const regex = /^[a-zA-Z0-9._*$%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        return regex.test(value) ? null : 'Допускается латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.';
    },
    password: (value: string): string | null => {
        const regex = /^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!*$#@]{8,40}$/;
        return regex.test(value) ? null : 'Допускается от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра';
    },
    phone: (value: string): string | null => {
        const regex = /^[/+]?[0-9]{10,15}$/;
        return regex.test(value) ? null : 'Допускается от 10 до 15 символов, состоит из цифр, может начинается с плюса';
    },
    message: (value: string): string | null => {
        return value.trim() ? null : 'Сообщение не должно быть пустым';
    }
};

export type FieldName = keyof typeof validators;

export class FormValidator {
    private errorFields: Record<string, string | null> = {};

    validateField(fieldName: FieldName, value: string): string | null {
        if (!validators[fieldName]) {
            return null
        }
        const error = validators[fieldName](value);
        this.errorFields[fieldName] = error;
        return error;
    }

    validateForm(formData: Record<string, unknown>): boolean {
        Object.values(formData).forEach((field) => {
            const fieldName = Object.keys(field as Record<string, unknown>)[0];
            const fieldValue = field[fieldName];
            if (validators[fieldName as FieldName]) {
                this.validateField(fieldName as FieldName, fieldValue);
            }
        });
        return Object.values(this.errorFields).every(error => error !== null);
    }

    getErrors(): Record<string, string | null> {
        return this.errorFields;
    }
}