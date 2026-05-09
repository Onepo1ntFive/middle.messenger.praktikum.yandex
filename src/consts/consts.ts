export enum Routes {
    LOGIN = '/',
    REGISTER = '/sign-up',
    MESSENGER = '/messenger',
    PROFILE = '/settings',
    BAD_SERVER = '/server-error',
    NOT_FOUND = '/*',
}

export interface IEvent extends EventTarget {
    form: HTMLFormElement;

    [key: string]: unknown;
}

export const BASE_URL = 'https://ya-praktikum.tech/api/v2';
export const WS_BASE_URL = 'wss://ya-praktikum.tech/ws/chats/';
