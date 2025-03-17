import {createSlice, PayloadAction} from '@reduxjs/toolkit';

interface Message {
  id: string;
  chatId: string;
  senderId: number;
  content: string;
  timestamp: string;
  receiverId: number;
}

export interface ChatState {
  messages: Record<string, Message[]>;
  users: Array<any>;
  lastMessages: Record<string, Message | null>;
}

const initialState: ChatState = {
  messages: {},
  users: [],
  lastMessages: {},
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      const {chatId} = action.payload;
      if (!state.messages[chatId]) {
        state.messages[chatId] = [];
      }
      state.messages[chatId].push(action.payload);
    },
    addUsers: (state, action: PayloadAction<Array<any>>) => {
      state.users = action.payload;
    },
    setMessages: (
      state,
      action: PayloadAction<{chatId: string; messages: Message[]}>,
    ) => {
      state.messages[action.payload.chatId] = action.payload.messages;
    },
    addLastMessage: (state, action: PayloadAction<Message>) => {
      const {chatId} = action.payload;
      state.lastMessages = {...state.lastMessages, [chatId]: action.payload};
    },
  },
});

export const {addMessage, setMessages, addUsers, addLastMessage} =
  chatSlice.actions;
export default chatSlice.reducer;
