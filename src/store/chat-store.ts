import { Conversation, Message, User } from "@prisma/client";
import { create } from "zustand";

type MessageWithUser = Message & {
  user: User;
};

type ChatStore = {
  showCreateConversationModal: boolean;
  conversationsLoading: boolean;
  activeConversationId: string | null;
  conversations: Conversation[];
  messageFeed: MessageWithUser[],
  setActiveConversation: (id: string|null) => void;
  setConversations: (conversations: Conversation[]) => void;
  setConversationsLoading: (loading: boolean) => void;
  setCreateConversationModal: (show: boolean) => void;
  setMessageFeed: (messages: MessageWithUser[]) => void;
  addMessageToFeed: (message: MessageWithUser) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  showCreateConversationModal: false,
  conversationsLoading: true,
  activeConversationId: null,
  conversations: [],
  messageFeed: [],
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setConversations: (conversations) => set({ conversations }),
  setConversationsLoading: (loading) => set({ conversationsLoading: loading }),
  setCreateConversationModal: (show) => set({ showCreateConversationModal: show }),
  setMessageFeed: (messages) => set({ messageFeed: messages }),
  addMessageToFeed: (message) => set((state) => ({ messageFeed: [...state.messageFeed, message] })),
}));