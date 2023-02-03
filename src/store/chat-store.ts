import { Conversation, Message, User } from "@prisma/client";
import { create } from "zustand";
import { MessageWithUser } from "../types/pusher-events";

type ConversationWithUsers = Conversation & { users: User[] };

type ChatStore = {
  showCreateConversationModal: boolean;
  showConversationsList: boolean;
  conversationsLoading: boolean;
  activeConversationId: string | null;
  conversations: ConversationWithUsers[];
  messageFeed: MessageWithUser[],
  setActiveConversation: (id: string|null) => void;
  setShowConversationsList: (show: boolean) => void;
  setConversations: (conversations: ConversationWithUsers[]) => void;
  setConversationsLoading: (loading: boolean) => void;
  setCreateConversationModal: (show: boolean) => void;
  setMessageFeed: (messages: MessageWithUser[]) => void;
  addMessageToFeed: (message: MessageWithUser) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  showCreateConversationModal: false,
  showConversationsList: false,
  conversationsLoading: true,
  activeConversationId: null,
  conversations: [],
  messageFeed: [],
  setActiveConversation: (id) => set({ activeConversationId: id }),
  setShowConversationsList: (show) => set({ showConversationsList: show }),
  setConversations: (conversations) => set({ conversations }),
  setConversationsLoading: (loading) => set({ conversationsLoading: loading }),
  setCreateConversationModal: (show) => set({ showCreateConversationModal: show }),
  setMessageFeed: (messages) => set({ messageFeed: messages }),
  addMessageToFeed: (message) => set((state) => ({ messageFeed: [...state.messageFeed, message] })),
}));