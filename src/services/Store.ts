import EventBus from '../services/EventBus';
import set from '../helpers/set';

export type Indexed<T = unknown> = {
    [key in string]: T;
};

export type TUserDetails = {
    id: number,
    first_name: string,
    second_name: string,
    display_name: string,
    phone: string,
    login: string,
    avatar: string,
    email: string
};

export type TProfileDetails = {
    first_name: string,
    second_name: string,
    display_name: string,
    login: string,
    email: string,
    phone: string
};
export type TCurrentChat = {
    id: number | null,
    chatUsers: Array<Omit<TUserDetails, 'phone' | 'email'> & { role: string }>,
    messages: Array<TMessage>,
    token: string | null,
};

export type TChatDetails = {
    id: number,
    title: string,
    avatar: string,
    unread_count: number,
    created_by: number,
    token: string | null,
    last_message: {
        user: Omit<TUserDetails, 'id' | 'display_name'>,
        time: string,
        content: string,
    } | null,
};

export type TMessage = {
    chat_id?: number,
    time: string,
    type?: string,
    user_id: number,
    content: string,
    file?: {
        id: number,
        user_id: number,
        path: string,
        filename: string,
        content_type: string,
        content_size: number,
        upload_date: string,
    },
};

export type TSettings = {
    showProfile: boolean,
    editProfile: boolean,
    showPassword: boolean,
    currentChatId: number,
}

export interface IState {
    isLoading: boolean,
    isAuthenticated: boolean,
    user: TUserDetails | null,
    chats: Array<TChatDetails>,
    currentChat: {
        id: number | null,
        chatUsers: Array<Omit<TUserDetails, 'phone' | 'email'> & { role: string }>,
        messages: Array<TMessage>,
        token: string | null,
    },
    settings: TSettings,
    searchResults: TUserDetails[],
    websocket: WebSocket | null,
}

export enum StoreEvents {
    STORE_UPD = 'updated',
}

class Store extends EventBus {
    private state: Indexed = {};
    static __instance: Store | null = null;

    constructor(defaultState: IState) {
        if (Store.__instance) {
            return Store.__instance;
        }

        super();

        this.set('', defaultState);
        Store.__instance = this;

        return this;
    }

    public getState(): IState {
        return this.state;
    }

    public set(path: string, value: unknown): void {
        set(this.state, path, value);
        this.emit(StoreEvents.STORE_UPD);
    }
}

export default new Store({
    isLoading: false,
    isAuthenticated: false,
    user: null,
    chats: [],
    currentChat: {
        id: null,
        chatUsers: [],
        messages: [],
        token: null,
    },
    settings: {
        showProfile: true,
        editProfile: false,
        showPassword: false,
        currentChatId: 0,
    },
    searchResults: [],
    websocket: null,
});
