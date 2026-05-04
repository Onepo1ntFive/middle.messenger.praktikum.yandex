import { Controller } from './Controller';
import ChatsApi, { IChatTitle } from '../api/ChatsApi';

class ChatController extends Controller {
    public getChats = async () => {
        return await ChatsApi.getChats();
    }

    public createChat = async (data: IChatTitle) => {
        return await ChatsApi.createChat(data);
    }
}

export default new ChatController();