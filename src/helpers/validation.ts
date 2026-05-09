const latinCyrillicRegex = /^[A-ZА-ЯЁ][a-zа-яё-]*$/;
const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9!*$#@]{8,40}$/;
const messages: Record<string, string> = {
    latinCyrillic: 'Допускается латиница или кириллица, первая буква должна быть заглавной, без пробелов и без цифр, нет спецсимволов (допустим только дефис).',
    notEmpty: 'Поле не должно быть пустым',
    login: 'Допускается от 3 до 20 символов, латиница, может содержать цифры, но не состоять из них, без пробелов, без спецсимволов (допустимы дефис и нижнее подчёркивание).',
    email: 'Допускается латиница, может включать цифры и спецсимволы вроде дефиса и подчёркивания, обязательно должна быть «собака» (@) и точка после неё, но перед точкой обязательно должны быть буквы.',
    password: 'Допускается от 8 до 40 символов, обязательно хотя бы одна заглавная буква и цифра',
    phone: 'Допускается от 10 до 15 символов, состоит из цифр, может начинается с плюса',
}

export const validators = {
    first_name: (value: string): string | null => {
        return latinCyrillicRegex.test(value) ? null : messages.latinCyrillic;
    },
    second_name: (value: string): string | null => {
        return latinCyrillicRegex.test(value) ? null : messages.latinCyrillic;
    },
    login: (value: string): string | null => {
        const regex = /^[a-zA-Z][a-zA-z-_0-9]{2,19}$/;
        return regex.test(value) ? null : messages.login;
    },
    email: (value: string): string | null => {
        const regex = /^[a-zA-Z0-9._*$%+-]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
        return regex.test(value) ? null : messages.email;
    },
    password: (value: string): string | null => {
        return passwordRegex.test(value) ? null : messages.password;
    },
    oldPassword: (value: string): string | null => {
        return passwordRegex.test(value) ? null : messages.password;
    },
    newPassword: (value: string): string | null => {
        return passwordRegex.test(value) ? null : messages.password;
    },
    phone: (value: string): string | null => {
        const regex = /^[/+]?[0-9]{10,15}$/;
        return regex.test(value) ? null : messages.phone;
    },
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
        Object.keys(formData).forEach((fieldName: FieldName) => {
            const fieldValue = formData[fieldName];
            if (validators[fieldName as FieldName] !== undefined) {
                this.validateField(fieldName as FieldName, fieldValue as string);
            }
        });
        return Object.keys(this.errorFields).some(error => this.errorFields[`${ error }`] !== null);
    }

    getErrors(): Record<string, string | null> {
        return this.errorFields;
    }
}
