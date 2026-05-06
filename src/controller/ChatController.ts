import { Controller } from './Controller';
import ChatsApi, { IChatTitle, IChatUsers } from '../api/ChatsApi';

class ChatController extends Controller {
    public getChats = async () => {
        return await ChatsApi.getChats();
    }

    public createChat = async (data: IChatTitle) => {
        return await ChatsApi.createChat(data);
    }

    public getChatUsers = async (chatId: number) => {
        return await ChatsApi.getChatUsers(chatId);
    }

    public addChatUser = async (data: IChatUsers) => {
        return await ChatsApi.addChatUser(data);
    }

    public deleteChatUser = async (data: IChatUsers) => {
        return await ChatsApi.deleteChatUser(data);
    }

    public getChatToken = async (chatId: number) => {
        return await ChatsApi.getChatToken(chatId);
    }
}

export default new ChatController();
