import { BaseApi } from './BaseApi';
import HTTPTransport from './HTTPTransport';

export interface IChatTitle {
    title: string,
}

const options = {
    headers: {
        Accept: 'application/json',
    },
};

export default class ChatsApi extends BaseApi {
    static async getChats() {
        return await new HTTPTransport().get('/chats', {...options});
    }
    static async createChat(data: IChatTitle) {
        return await new HTTPTransport().post('/chats', {...options, data});
    }
}