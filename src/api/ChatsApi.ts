import { BaseApi } from './BaseApi';
import HTTPTransport from './HTTPTransport';

export interface IChatTitle {
    title: string,
}

export interface IChatUsers {
    users: Array<number>,
    chatId: number
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

    static async getChatUsers(chatId: number) {
        return await new HTTPTransport().get(`/chats/${ chatId }/users`, options);
    }

    static async addChatUser(data: IChatUsers) {
        return await new HTTPTransport().put(`/chats/users`, {...options, data});
    }
    static async deleteChatUser(data: IChatUsers) {
        return await new HTTPTransport().delete(`/chats/users`, {...options, data});
    }
}